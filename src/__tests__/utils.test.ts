import { getSupportedImage, isUrl } from '../utils'

describe('getSupportedImage', () => {
  it('should return undefined', () => {
    expect.assertions(3)
    const images = ['amazing.svg']
    expect(getSupportedImage()).toBeUndefined()
    expect(getSupportedImage(images)).toBeUndefined()
    expect(getSupportedImage(null)).toBeUndefined()
  })
  it('should first coincidence', () => {
    expect.assertions(1)
    const images = ['amazing.jpeg', 'anotherGreatPicture.gif']
    expect(getSupportedImage(images)).toStrictEqual(images[0])
  })
})

describe('isUrl', () => {
  it('should return false', () => {
    expect.assertions(4)
    expect(isUrl()).toStrictEqual(false)
    expect(isUrl('wrong string')).toStrictEqual(false)
    expect(isUrl('https://')).toStrictEqual(false)
    expect(isUrl('file:some/path"')).toStrictEqual(false)
  })
  it('should return true', () => {
    expect.assertions(5)
    const topHundredWebsites = [
      'https://www.facebook.com',
      'http://www.youtube.com?asdasds=asdasd',
      'http://www.baidu.com?asd?dasdsaa=asd',
      'http://www.a.pl',
      'http://www.answers.yahoo.com',
    ]
    topHundredWebsites.forEach((url) => {
      expect(isUrl(url)).toStrictEqual(true)
    })
  })
})
