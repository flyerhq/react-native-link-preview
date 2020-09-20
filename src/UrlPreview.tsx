import { getLinkPreview } from 'link-preview-js'
import * as React from 'react'
import {
  Image,
  ImageBackground,
  ImageProps,
  LayoutChangeEvent,
  Linking,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle,
} from 'react-native'
import ParsedText from 'react-native-parsed-text'
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, getSupportedImage, NEW_REGEX } from '.'
import styles, { sizeStyle } from './styles'
import { UrlData } from './types'

export interface Size {
  height: number
  width: number
}

export type URLOptions = {
  headers?: Record<string, string>
  imagesPropertyType?: string
}

export type RenderReactNode = (text?: string) => React.ReactNode

export interface Props {
  containerStyle?: StyleProp<ViewStyle>
  containerWidth?: number
  descriptionProps?: StyleProp<TextProps>
  imageProps?: StyleProp<ImageProps>
  noImageContainerStyle?: StyleProp<ViewStyle>
  onError?: (error: Error) => void
  renderDescription?: RenderReactNode
  renderImage?: RenderReactNode
  renderTitle?: RenderReactNode
  testID?: string
  text: string
  titleContainer?: StyleProp<ViewStyle>
  titleProps?: StyleProp<TextProps>
  touchableWithoutFeedbackProps?: TouchableWithoutFeedbackProps
  urlOptions?: URLOptions
}

export const UrlPreview = React.memo(
  ({
    containerStyle,
    containerWidth,
    descriptionProps,
    imageProps,
    renderDescription,
    renderImage,
    renderTitle,
    testID,
    text,
    titleContainer,
    titleProps,
    touchableWithoutFeedbackProps,
    urlOptions,
  }: Props) => {
    const [size, setSize] = React.useState<Size>({
      height: DEFAULT_HEIGHT,
      width: DEFAULT_WIDTH,
    })

    const [containerSize, setContainerSize] = React.useState<Size>({
      height: 0,
      width: 0,
    })

    const { imageStyle } = sizeStyle({
      messageWidth: containerWidth ?? containerSize.width,
      size,
    })

    const [urlData, setUrlData] = React.useState<UrlData | undefined>()

    const [imageSource, setImageSource] = React.useState<string | undefined>()

    React.useEffect(() => {
      let isCancelled = false
      async function getLinkPreviewHandler() {
        try {
          const preview = await getLinkPreview(text, urlOptions)
          if (!isCancelled) {
            setImage(preview)
            setUrlData(preview)
          }
        } catch (err) {
          if (!isCancelled) {
            setUrlData(undefined)
          }
        }
      }
      getLinkPreviewHandler()
      return () => {
        isCancelled = true
      }
    }, [text, urlOptions])

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
        getSupportedImage(data?.images) ?? getSupportedImage(data?.favicons)
      setImageSource(image)
    }

    const handlePress = async (link: string) => {
      await Linking.openURL(link)
    }

    const renderHeaderNode = () => (
      <View style={StyleSheet.flatten([styles.container, titleContainer])}>
        <ParsedText
          style={styles.headerText}
          parse={[{ type: 'url', style: styles.url, onPress: handlePress }]}
        >
          {text}
        </ParsedText>
      </View>
    )

    const onBodyLayout = (e: LayoutChangeEvent) => {
      const { height, width } = e.nativeEvent.layout
      setContainerSize({ height, width })
    }

    const renderBodyNode = () =>
      imageSource && (
        <ImageBackground
          blurRadius={26}
          source={{ uri: imageSource }}
          style={StyleSheet.flatten([styles.bodyContainer])}
        >
          {renderImageNode()}
        </ImageBackground>
      )

    const renderBottomNode = () =>
      (urlData?.title || urlData?.description) && (
        <View
          style={StyleSheet.flatten([styles.container, styles.bottomContainer])}
        >
          {renderTitleNode()}
          {renderDescriptionNode()}
        </View>
      )

    const renderDescriptionNode = () => {
      if (renderDescription) return renderDescription(urlData?.description)
      return (
        urlData?.description && (
          <Text style={styles.bodyText} numberOfLines={6} {...descriptionProps}>
            {urlData?.description}
          </Text>
        )
      )
    }

    const renderImageNode = () => {
      if (renderImage) return renderImage(imageSource)
      return (
        <Image
          accessibilityRole='image'
          resizeMode='contain'
          source={{ uri: imageSource }}
          style={StyleSheet.flatten([styles.image, imageStyle])}
          {...imageProps}
        />
      )
    }

    const renderTitleNode = () => {
      if (renderTitle) return renderTitle(urlData?.title)
      return urlData?.title ? (
        <Text
          style={StyleSheet.flatten([
            styles.titleText,
            styles.titleBottomMargin,
          ])}
          numberOfLines={2}
          {...titleProps}
        >
          {urlData?.title}
        </Text>
      ) : null
    }

    const onPreviewPress = () => {
      const link = text.match(NEW_REGEX)?.[0]
      if (link) {
        handlePress(link)
      }
    }

    if (!text) return null

    return (
      <TouchableWithoutFeedback
        onPress={onPreviewPress}
        testID={testID}
        {...touchableWithoutFeedbackProps}
      >
        <View
          testID='container'
          style={StyleSheet.flatten([
            containerStyle,
            { width: containerWidth },
          ])}
          onLayout={containerWidth ? undefined : onBodyLayout}
        >
          {renderHeaderNode()}
          {renderBodyNode()}
          {renderBottomNode()}
        </View>
      </TouchableWithoutFeedback>
    )
  }
)
