import * as React from 'react'
import {
  Image,
  LayoutChangeEvent,
  Linking,
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle,
} from 'react-native'

import styles from './styles'
import { PreviewData, PreviewDataImage } from './types'
import { getPreviewData, oneOf } from './utils'

export interface LinkPreviewProps {
  containerStyle?: StyleProp<ViewStyle>
  metadataContainerStyle?: StyleProp<ViewStyle>
  metadataTextContainerStyle?: StyleProp<ViewStyle>
  onPreviewDataFetched?: (previewData: PreviewData) => void
  previewData?: PreviewData
  renderDescription?: (description: string) => React.ReactNode
  renderImage?: (image: PreviewDataImage) => React.ReactNode
  renderLinkPreview?: (payload: {
    aspectRatio?: number
    containerWidth: number
    previewData?: PreviewData
  }) => React.ReactNode
  renderMinimizedImage?: (image: PreviewDataImage) => React.ReactNode
  renderText?: (text: string) => React.ReactNode
  renderTitle?: (title: string) => React.ReactNode
  text: string
  textContainerStyle?: StyleProp<ViewStyle>
  touchableWithoutFeedbackProps?: TouchableWithoutFeedbackProps
}

export const LinkPreview = React.memo(
  ({
    containerStyle,
    metadataContainerStyle,
    metadataTextContainerStyle,
    onPreviewDataFetched,
    previewData,
    renderDescription,
    renderImage,
    renderLinkPreview,
    renderMinimizedImage,
    renderText,
    renderTitle,
    text,
    textContainerStyle,
    touchableWithoutFeedbackProps,
  }: LinkPreviewProps) => {
    const [containerWidth, setContainerWidth] = React.useState(0)
    const [data, setData] = React.useState(previewData)
    const aspectRatio = data?.image
      ? data.image.width / data.image.height
      : undefined

    React.useEffect(() => {
      let isCancelled = false
      if (previewData) return
      const fetchData = async () => {
        setData(undefined)
        const newData = await getPreviewData(text)
        // Set data only if component is still mounted
        /* istanbul ignore next */
        if (!isCancelled) {
          setData(newData)
          onPreviewDataFetched?.(newData)
        }
      }

      fetchData()
      return () => {
        isCancelled = true
      }
    }, [onPreviewDataFetched, previewData, text])

    const handleContainerLayout = React.useCallback(
      (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width)
      },
      []
    )

    const handlePress = () => data?.link && Linking.openURL(data.link)

    const renderDescriptionNode = (description: string) => {
      return oneOf(
        renderDescription,
        <Text numberOfLines={3} style={styles.description}>
          {description}
        </Text>
      )(description)
    }

    const renderImageNode = (image: PreviewDataImage) => {
      return oneOf(
        renderImage,
        <Image
          accessibilityRole='image'
          source={{ uri: image.url }}
          style={StyleSheet.flatten([
            styles.image,
            {
              aspectRatio,
              maxHeight: containerWidth,
              width: containerWidth,
            },
          ])}
        />
      )(image)
    }

    const renderLinkPreviewNode = () => {
      return oneOf(
        renderLinkPreview,
        <>
          <View
            style={StyleSheet.flatten([
              styles.textContainer,
              textContainerStyle,
            ])}
          >
            {renderTextNode()}
            {/* Render metadata only if there are either description OR title OR
                there is an image with an aspect ratio of 1 and either description or title
              */}
            {(data?.description ||
              (data?.image &&
                aspectRatio === 1 &&
                (data?.description || data?.title)) ||
              data?.title) && (
              <View
                style={StyleSheet.flatten([
                  styles.metadataContainer,
                  metadataContainerStyle,
                ])}
              >
                <View
                  style={StyleSheet.flatten([
                    styles.metadataTextContainer,
                    metadataTextContainerStyle,
                  ])}
                >
                  {data?.title && renderTitleNode(data.title)}
                  {data?.description && renderDescriptionNode(data.description)}
                </View>
                {data?.image &&
                  aspectRatio === 1 &&
                  renderMinimizedImageNode(data.image)}
              </View>
            )}
          </View>
          {/* Render image node only if there is an image with an aspect ratio not equal to 1
              OR there are no description and title
            */}
          {data?.image &&
            (aspectRatio !== 1 || (!data?.description && !data.title)) &&
            renderImageNode(data.image)}
        </>
      )({
        aspectRatio,
        containerWidth,
        previewData: data,
      })
    }

    const renderMinimizedImageNode = (image: PreviewDataImage) => {
      return oneOf(
        renderMinimizedImage,
        <Image
          accessibilityRole='image'
          source={{ uri: image.url }}
          style={styles.minimizedImage}
        />
      )(image)
    }

    const renderTextNode = () => oneOf(renderText, <Text>{text}</Text>)(text)

    const renderTitleNode = (title: string) => {
      return oneOf(
        renderTitle,
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
      )(title)
    }

    return (
      <TouchableWithoutFeedback
        accessibilityRole='button'
        onPress={handlePress}
        {...touchableWithoutFeedbackProps}
      >
        <View onLayout={handleContainerLayout} style={containerStyle}>
          {renderLinkPreviewNode()}
        </View>
      </TouchableWithoutFeedback>
    )
  }
)
