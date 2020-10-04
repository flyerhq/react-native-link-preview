import { AllHtmlEntities } from 'html-entities'
import { Image } from 'react-native'
import { PreviewData, PreviewDataImage, Size } from './types'

export const getActualImageUrl = (baseUrl: string, imageUrl?: string) => {
  let actualImageUrl = imageUrl?.trim()
  if (!actualImageUrl || actualImageUrl.startsWith('data')) return

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

export const getActualText = (text?: string) => {
  const actualText = text?.trim()
  if (!actualText) return

  return AllHtmlEntities.decode(actualText)
}

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
        if (!curr[2] || !curr[4]) return acc

        // Only take the first occurrence
        // For description take the meta description tag into consideration
        const description =
          !acc.description &&
          (getContent(curr[2], curr[4], 'og:description') ||
            getContent(curr[2], curr[4], 'description'))
        const ogImage =
          !acc.imageUrl && getContent(curr[2], curr[4], 'og:image')
        const ogTitle = !acc.title && getContent(curr[2], curr[4], 'og:title')

        return {
          description: description
            ? getActualText(description)
            : acc.description,
          imageUrl: ogImage ? getActualImageUrl(link, ogImage) : acc.imageUrl,
          title: ogTitle ? getActualText(ogTitle) : acc.title,
        }
      },
      { title: previewData.title }
    )

    previewData.description = metaPreviewData.description
    previewData.image = await getPreviewDataImage(metaPreviewData.imageUrl)
    previewData.title = metaPreviewData.title

    if (!previewData.image) {
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
    return
  }
}

export const LINK_REGEX = /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_+[\],.~#?&/=]*[-a-zA-Z0-9@:%_+\]~#?&/=])*/i
