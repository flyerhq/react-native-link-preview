import { getLinkPreview } from 'link-preview-js'
import * as React from 'react'
import {
  ActivityIndicator,
  Image,
  ImageProps,
  Linking,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import styles from './styles'
import { UrlData } from './types'

const URL_REGEX = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i

interface Props {
  containerStyle?: StyleProp<ViewStyle>
  descriptionProps?: TextProps
  imageProps?: ImageProps
  noImageContainerStyle?: StyleProp<ViewStyle>
  onError?: (error: Error) => void
  onLoadEnd?: (urlData: UrlData) => void
  renderDescription?: (description?: string) => React.ReactNode
  renderImage?: (imageUrl?: string) => React.ReactNode
  renderLoader?: () => React.ReactNode
  renderSiteName?: (name?: string) => React.ReactNode
  renderTitle?: (title?: string) => React.ReactNode
  siteNameProps?: TextProps
  titleProps?: TextProps
  url: string
  urlOptions?: {
    headers?: Record<string, string>
    imagesPropertyType?: string
  }
}

const UrlPreview = ({
  containerStyle,
  descriptionProps,
  imageProps,
  noImageContainerStyle,
  onError,
  onLoadEnd,
  renderDescription,
  renderImage,
  renderLoader,
  renderSiteName,
  renderTitle,
  siteNameProps,
  titleProps,
  url,
  urlOptions,
}: Props) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [urlData, setUrlData] = React.useState<UrlData | undefined>()
  const [error, setError] = React.useState<Error | undefined>()

  const getPreview = React.useCallback(
    async (urlString: string) => {
      try {
        const preview = await getLinkPreview(urlString, urlOptions)
        onLoadEnd?.(preview)
        setError(undefined)
        setIsLoaded(true)
        setUrlData(preview)
      } catch (err) {
        onError?.(err)
        setError(err)
        setIsLoaded(false)
        setUrlData(undefined)
      }
    },
    [onError, onLoadEnd, urlOptions]
  )

  React.useEffect(() => {
    if (url) getPreview(url)
  }, [getPreview, url])

  const handlePress = async () => {
    const link = url.match(URL_REGEX)?.[0]

    if (link) {
      const canOpen = await Linking.canOpenURL(link)
      if (canOpen) Linking.openURL(link)
    }
  }

  const renderDescriptionNode = () => {
    if (renderDescription) return renderDescription(urlData?.description)
    return urlData?.description ? (
      <Text style={styles.descriptionText} {...descriptionProps}>
        {urlData?.description}
      </Text>
    ) : null
  }

  const renderImageNode = () => {
    const image = urlData?.images?.[0]
    if (renderImage) return renderImage(image)
    if (image)
      return (
        <Image
          resizeMode='contain'
          source={{ uri: image }}
          style={styles.imageContainer}
          {...imageProps}
        />
      )

    return (
      <View
        style={StyleSheet.flatten([
          styles.noImageContainer,
          noImageContainerStyle,
        ])}
      >
        <Text style={styles.descriptionText} {...descriptionProps}>
          {urlData?.title ?? ''}
        </Text>
      </View>
    )
  }

  const renderLoaderNode = () =>
    renderLoader?.() ?? <ActivityIndicator size='large' />

  const renderSiteNameNode = () => {
    if (renderSiteName) return renderSiteName(urlData?.siteName)
    return urlData?.siteName ? (
      <Text style={styles.titleTextBold} {...siteNameProps}>
        {urlData?.siteName}
      </Text>
    ) : null
  }

  const renderTitleNode = () => {
    if (renderTitle) return renderTitle(urlData?.title)
    return urlData?.title ? (
      <Text style={styles.titleText} {...titleProps}>
        {urlData?.title}
      </Text>
    ) : null
  }

  const renderUrlPreview = () => {
    return (
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
        {error ? (
          <TouchableOpacity>
            <Text style={styles.descriptionText}>{error.message}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handlePress}>
            {renderImageNode()}
            {renderSiteNameNode()}
            {renderTitleNode()}
            {renderDescriptionNode()}
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return isLoaded || error ? renderUrlPreview() : <>{renderLoaderNode()}</>
}

export default UrlPreview
