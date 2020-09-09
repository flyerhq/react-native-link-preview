import { StyleSheet } from 'react-native'
import { Size } from '.'
import colors from './colors'

export const DEFAULT_HEIGHT = 170
export const DEFAULT_WIDTH = 300

export const sizeStyle = ({
  messageWidth,
  size,
}: {
  messageWidth: number
  size: Size
}) =>
  StyleSheet.create({
    imageStyle: {
      aspectRatio: size.height > 0 ? size.width / size.height : 1,
      maxHeight: messageWidth,
      minWidth: 170,
      width: messageWidth,
    },
  })

export default StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  headerContainer: {
    backgroundColor: colors.brand,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: colors.bodyBackground,
  },
  bottomContainer: {
    backgroundColor: colors.contentBackground,
  },
  url: {
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  headerText: {
    fontFamily: 'Avenir',
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  titleText: {
    fontFamily: 'Avenir',
    fontSize: 16,
    lineHeight: 22,
    color: colors.dark,
    fontWeight: '800',
  },
  titleBottomMargin: {
    marginBottom: 4,
  },
  bodyText: {
    fontFamily: 'Avenir',
    fontSize: 14,
    lineHeight: 19,
    color: colors.dark,
  },
  imageBackground: {
    flex: 1,
  },
})
