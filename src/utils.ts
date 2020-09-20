import { NEW_REGEX, RN_SUPPORTED_IMAGES } from '.'

const getSupportedImage = (images?: string[]) =>
  images?.find((favicon) => RN_SUPPORTED_IMAGES.test(favicon))

const isUrl = (url?: string) => {
  if (!url) return false
  return new RegExp(NEW_REGEX).test(url)
}

export { getSupportedImage, isUrl }
