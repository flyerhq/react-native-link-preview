import { AllHtmlEntities } from 'html-entities'
import { Image } from 'react-native'
import { PreviewData, PreviewDataImage, Size } from './types'

export const getActualImageUrl = (baseUrl: string, imageUrl?: string) => {
  let actualImageUrl = imageUrl?.trim()
  if (!actualImageUrl || actualImageUrl.startsWith('data')) return
  // Put it in enum all these cases, it allows You to have different true options as an object with proper output
  if (actualImageUrl.startsWith('//'))
    actualImageUrl = `https:${actualImageUrl}`

  if (!actualImageUrl.startsWith('http')) {
    if (baseUrl.endsWith('/') && actualImageUrl.startsWith('/')) {
      actualImageUrl = `${baseUrl.slice(0, -1)}${actualImageUrl}`
    } else if (!baseUrl.endsWith('/') && !actualImageUrl.startsWith('/')) {
      actualImageUrl = `${baseUrl}/${actualImageUrl}`
    } else {
      actualImageUrl = `${baseUrl}${actualImageUrl}`
    }
  }

  // if(!['.png','.jpg','.jpeg','.bmp','.gif','.webp','.psd','.ico'].some(actualImageUrl?.endsWith) return `${actualImageUrl}.png`
  if (
    ![
      '.png',
      '.jpg',
      '.jpeg',
      '.bmp',
      '.gif',
      '.webp',
      '.psd',
      '.ico',
    ].some((s) => actualImageUrl?.endsWith(s))
  )
    actualImageUrl = `${actualImageUrl}.png`

  return actualImageUrl
}

// export const getActualText = (text = '') => {
//  const actualText = text.trim()
//  return actualText ? AllHtmlEntities.decode(actualText) : undefined
// }
export const getActualText = (text?: string, defaultText?: string) => {
  const actualText = text?.trim()
  if (!actualText) return defaultText

  return AllHtmlEntities.decode(actualText)
}

// export const getContent = (left: string, right: string, type: string) => {
//  const contents = {
//      [left.trim()]: right,
//      [right.trim()]: left
//  }
//  return contents[type]?.trim
// }
export const getContent = (left: string, right: string, type: string) => {
  if (left.trim() === type) return right.trim()
  if (right.trim() === type) return left.trim()
}

export const getImageSize = (url: string) => {
  return new Promise<Size>((resolve, reject) => {
    Image.getSize(
      url,
      (width, height) => {
        resolve({ height, width })
      },
      // type-coverage:ignore-next-line
      (error) => reject(error)
    )
  })
}

export const getPreviewData = async (text: string) => {
  const previewData: PreviewData = {
    description: undefined,
    image: undefined,
    link: undefined,
    title: undefined,
  }

  try {
    const link = text.match(LINK_REGEX)?.[0]

    if (!link) return previewData

    const response = await fetch(link)

    previewData.link = link

    const contentType = response.headers.get('content-type') ?? ''

    // If you use RegExp without and you don't need return value just use test instead exec
    if (new RegExp('image/*', 'g').exec(contentType)) {
      const image = await getPreviewDataImage(link)
      previewData.image = image
      return previewData
    }

    const html = await response.text()

    // Some pages return undefined
    if (!html) return previewData

    const head = html.substring(0, html.indexOf('<body'))

    // Get page title
    const title = new RegExp('<title.*?>(.*?)</title>', 'g').exec(head)
    previewData.title = getActualText(title?.[1])

    const meta = [
      ...head.matchAll(
        new RegExp(
          // Some pages write content before the name/property, some use single quotes instead of double
          '<meta.*?(property|name|content)=["\'](.*?)["\'].*?(property|name|content)=["\'](.*?)["\'].*?>',
          'g'
        )
      ),
    ]

    const metaPreviewData = meta.reduce<{
      description?: string
      imageUrl?: string
      title?: string
    }>(
      (acc, curr) => {
        // Verify that we have property/name and content
        // Note that if a page will specify property, name and content in the same meta, regex will fail
        const SECOND = curr[2]
        const FOURTH = curr[4]
        if (!SECOND || !FOURTH) return acc
        // Too much usage of arrray[index], just move the constants        
        // Only take the first occurrence const SECOND = curr[2]; const FOURTH = curr[4] and use it through the function
        // For description take the meta description tag into consideration
        const description =
          !acc.description &&
          (getContent(SECOND, FOURTH, 'og:description') ||
            getContent(SECOND, FOURTH, 'description'))
        const ogImage =
          !acc.imageUrl && getContent(SECOND, FOURTH, 'og:image')
        const ogTitle = !acc.title && getContent(SECOND, FOURTH, 'og:title')

        return {
          // Changed
          description: getActualText(description, acc.description),
          imageUrl: ogImage ? getActualImageUrl(link, ogImage) : acc.imageUrl,
          title: getActualText(ogTitle, acc.title),
        }
      },
      { title: previewData.title }
    )

    previewData.description = metaPreviewData.description
    previewData.image = await getPreviewDataImage(metaPreviewData.imageUrl)
    previewData.title = metaPreviewData.title

    if (!previewData.image) {
      // Move RegExp to the variables with understandable meaning (all of it)
      const imageSrc = new RegExp(
        '<link.*?rel=["\']image_src["\'].*?href=["\'](.*?)["\'].*?>',
        'g'
      ).exec(head)
      previewData.image = await getPreviewDataImage(
        getActualImageUrl(link, imageSrc?.[1])
      )
    }

    if (!previewData.image) {
      const imgTags = [
        // Consider empty line after img tag and take only the src field, space before to not match data-src for example
        // eslint-disable-next-line no-control-regex
        ...html.matchAll(new RegExp('<img[\n\r]*.*? src=["\'](.*?)["\']', 'g')),
      ]

      let images: PreviewDataImage[] = []

      // Please check if it's w hat You are trying achieve
      // Promise.all(imgTags.map((tag) => getPreviewDataImage(getActualImageUrl(link, tag[1])))).then(res => images = res.filter(Boolean))

      for (const tag of imgTags) {
        const image = await getPreviewDataImage(getActualImageUrl(link, tag[1]))

        if (!image) continue

        images = [...images, image]
      }

      previewData.image = images.sort(
        (a, b) => b.height * b.width - a.height * a.width
      )[0]
    }

    return previewData
  } catch {
    // A bit confusing
    return previewData
  }
}

export const getPreviewDataImage = async (url?: string) => {
    if (!url) return
  
    try {
      const { height, width } = await getImageSize(url)
      const aspectRatio = height > 0 ? width / height : 1
  
      if (height > 100 && width > 100 && aspectRatio > 0.1 && aspectRatio < 10) {
        return {
          height,
          url,
          width,
        }
      }
    } catch {
        // Is this return for typescript
      return
    }
  }

export const LINK_REGEX = /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_+[\],.~#?&/=]*[-a-zA-Z0-9@:%_+\]~#?&/=])*/i
