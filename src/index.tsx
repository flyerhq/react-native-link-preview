import { getLinkPreview } from 'link-preview-js'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import styles from './styles'
import { UrlData } from './types'

const REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

type RenderComponent = (value?: string) => React.ReactElement
interface Props {
  url: string
  onError?: (error: Error) => void
  onLoadEnd?: (urlData: UrlData) => void
  renderLoader?: RenderComponent
  renderSiteName?: RenderComponent
  renderTitle?: RenderComponent
  renderDescription?: RenderComponent
  renderImage?: RenderComponent
  siteNameNumberOfLines?: number
  titleNumberOfLines?: number
  descriptionNumberOfLines?: number
  getLinkProps?: {
    headers?: Record<string, string>
    imagesPropertyType?: string
  }
  showSiteName?: boolean
  showTitle?: boolean
  showDescription?: boolean
  containerStyle?: Record<string, unknown>
}

const ReactUrlPreview = ({
  url,
  onError,
  onLoadEnd,
  renderLoader,
  siteNameNumberOfLines = 1,
  titleNumberOfLines = 2,
  descriptionNumberOfLines = 3,
  showSiteName = true,
  showTitle = true,
  showDescription = true,
  renderImage,
  renderSiteName,
  renderTitle,
  renderDescription,
  containerStyle,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [urlData, setUrlData] = useState<UrlData>()
  const [error, setError] = useState()

  const getUrl = useCallback(
    async (urlString: string) => {
      try {
        const linkPreviewData = await getLinkPreview(urlString)
        setUrlData(linkPreviewData as UrlData)
        setIsLoaded(true)
        onLoadEnd?.(linkPreviewData as UrlData)
      } catch (err) {
        const errorMessage = err.toString()
        setIsLoaded(false)
        setError(errorMessage)
        onError?.(errorMessage)
      }
    },
    [onError, onLoadEnd]
  )

  useEffect(() => {
    if (url) getUrl(url)
  }, [getUrl, url])

  const onPress = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const link = url.match(REGEX)[0]
    Linking.canOpenURL(link).then((value) => {
      if (value) Linking.openURL(link)
    })
  }

  const renderImageContainer = () => {
    const image = urlData?.images?.[0] ?? urlData?.favicons?.[0]
    if (renderImage) return renderImage(image)
    if (image)
      return (
        <Image
          style={styles.imageStyle}
          source={{ uri: image }}
          resizeMode='cover'
        />
      )

    return (
      <View style={styles.noImageStyle}>
        <Text style={styles.noImageTextStyle} numberOfLines={2}>
          {urlData?.title ?? ''}
        </Text>
      </View>
    )
  }

  const renderSiteNameContainer = () => {
    if (renderSiteName) return renderSiteName(urlData?.siteName)
    return showSiteName && urlData?.siteName ? (
      <Text
        numberOfLines={siteNameNumberOfLines}
        style={[styles.titleStyle, styles.siteTitle]}
      >
        {urlData?.siteName}
      </Text>
    ) : null
  }

  const renderTitleContainer = () => {
    if (renderTitle) return renderTitle(urlData?.title)
    return showTitle && urlData?.title ? (
      <Text numberOfLines={titleNumberOfLines} style={styles.titleStyle}>
        {urlData?.title}
      </Text>
    ) : null
  }

  const renderDescriptionContainer = () => {
    if (renderDescription) return renderDescription(urlData?.description)
    return showDescription && urlData?.description ? (
      <Text
        numberOfLines={descriptionNumberOfLines}
        style={styles.descriptionStyle}
      >
        {urlData?.description}
      </Text>
    ) : null
  }

  const renderHeader = () => (
    <View>
      {renderSiteNameContainer()}
      {renderTitleContainer()}
      {renderDescriptionContainer()}
    </View>
  )

  const renderLoaderElement = () =>
    renderLoader?.() ?? <ActivityIndicator size='large' />

  const renderLinkPreview = () => {
    return error ? (
      <TouchableOpacity style={styles.containerStyle} activeOpacity={0.85}>
        <Text style={styles.errorText}>{error}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={[styles.containerStyle, containerStyle]}
        activeOpacity={0.85}
        onPress={onPress}
      >
        {renderImageContainer()}
        {renderHeader()}
      </TouchableOpacity>
    )
  }
  return isLoaded || error ? renderLinkPreview() : renderLoaderElement()
}

export default ReactUrlPreview
