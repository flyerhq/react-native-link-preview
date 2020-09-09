import { getLinkPreview } from 'link-preview-js'
import * as React from 'react'
import {
  Image,
  ImageProps,
  LayoutChangeEvent,
  Linking,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import ParsedText from 'react-native-parsed-text'
import styles, { DEFAULT_HEIGHT, DEFAULT_WIDTH, sizeStyle } from './styles'
import { UrlData } from './types'

const URL_REGEX = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i

export interface Size {
  height: number
  width: number
}

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
  onError,
  onLoadEnd,
  renderDescription,
  renderImage,
  renderLoader,
  renderTitle,
  titleProps,
  url,
  urlOptions,
}: Props) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [size, setSize] = React.useState<Size>({
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
  })
  const [containerSize, setContainerSize] = React.useState<Size>({
    height: 0,
    width: 0,
  })
  // TODO: DEFAULT_WIDTH should be passed parameter
  const { imageStyle } = sizeStyle({
    messageWidth: containerSize.width,
    size,
  })
  const [urlData, setUrlData] = React.useState<UrlData | undefined>()
  const [imageSource, setImageSource] = React.useState<string | undefined>()
  const [error, setError] = React.useState<Error | undefined>()

  const getPreview = React.useCallback(
    async (urlString: string) => {
      try {
        const preview = await getLinkPreview(urlString, urlOptions)
        onLoadEnd?.(preview)
        setImage(preview)
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

  React.useEffect(() => {
    if (imageSource)
      Image.getSize(
        imageSource,
        (width, height) => setSize({ height, width }),
        () => setSize({ height: 0, width: 0 })
      )
  }, [imageSource])

  const setImage = (data: UrlData) => {
    const image =
      data?.images?.[0] ??
      data?.favicons.find((favicon) =>
        /\.(gif|jpe?g|png|webp|bmp)$/i.test(favicon)
      )
    setImageSource(image)
  }

  const handlePress = async (link?: string) => {
    if (link) {
      const canOpen = await Linking.canOpenURL(link)
      if (canOpen) Linking.openURL(link)
    }
  }

  const renderHeaderNode = () => (
    <View
      style={StyleSheet.flatten([styles.container, styles.headerContainer])}
    >
      <ParsedText
        style={styles.headerText}
        parse={[{ type: 'url', style: styles.url, onPress: handlePress }]}
      >
        {url}
      </ParsedText>
    </View>
  )

  const onBodyLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout
    setContainerSize({ height, width })
  }

  const renderBodyNode = () =>
    imageSource ? (
      <View
        style={StyleSheet.flatten([styles.bodyContainer])}
        onLayout={onBodyLayout}
      >
        {renderImageNode()}
      </View>
    ) : null

  const renderBottomNode = () =>
    urlData?.title || urlData?.description ? (
      <View
        style={StyleSheet.flatten([styles.container, styles.bottomContainer])}
      >
        {renderTitleNode()}
        {renderDescriptionNode()}
      </View>
    ) : null

  const renderDescriptionNode = () => {
    if (renderDescription) return renderDescription(urlData?.description)
    return urlData?.description ? (
      <Text style={styles.bodyText} {...descriptionProps}>
        {urlData?.description}
      </Text>
    ) : null
  }

  const renderImageNode = () => {
    if (renderImage) return renderImage(imageSource)
    if (imageSource)
      return (
        <Image
          resizeMode='center'
          source={{ uri: imageSource }}
          style={imageStyle}
          {...imageProps}
        />
      )
  }

  const renderLoaderNode = () => renderLoader?.() ?? null

  const renderTitleNode = () => {
    if (renderTitle) return renderTitle(urlData?.title)
    return urlData?.title ? (
      <Text
        style={StyleSheet.flatten([styles.titleText, styles.titleBottomMargin])}
        numberOfLines={2}
        {...titleProps}
      >
        {urlData?.title}
      </Text>
    ) : null
  }

  const renderUrlPreview = () => {
    const link = url.match(URL_REGEX)?.[0]
    return (
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
        <TouchableOpacity onPress={() => handlePress(link)}>
          {renderHeaderNode()}
          {renderBodyNode()}
          {renderBottomNode()}
        </TouchableOpacity>
      </View>
    )
  }

  return isLoaded || error ? renderUrlPreview() : <>{renderLoaderNode()}</>
}

export default UrlPreview
