import { act } from '@testing-library/react-native'
import { Image } from 'react-native'
import * as utils from '../utils'

describe('getActualImageUrl', () => {
  it('returns undefined if no image url is provided', () => {
    expect.assertions(1)
    const baseUrl = 'https://github.com/flyerhq/'
    const url = utils.getActualImageUrl(baseUrl)
    expect(url).toBeUndefined()
  })

  it('returns undefined if image is base64 formatted', () => {
    expect.assertions(1)
    const baseUrl = 'https://github.com/flyerhq/'
    const url = utils.getActualImageUrl(baseUrl, 'data://')
    expect(url).toBeUndefined()
  })

  it('adds https: if image url starts with //', () => {
    expect.assertions(1)
    const baseUrl = 'https://github.com/flyerhq/'
    const imageUrl = '//avatars2.githubusercontent.com/u/59206044'
    const url = utils.getActualImageUrl(baseUrl, imageUrl)
    expect(url).toStrictEqual('https:' + imageUrl)
  })

  it("adds base url if image url doesn't start with a http and removes double slash", () => {
    expect.assertions(1)
    const baseUrl = 'https://avatars2.githubusercontent.com/'
    const imageUrl = '/u/59206044'
    const url = utils.getActualImageUrl(baseUrl, imageUrl)
    expect(url).toStrictEqual(
      'https://avatars2.githubusercontent.com/u/59206044'
    )
  })

  it("adds base url if image url doesn't start with a http and adds a slash if needed", () => {
    expect.assertions(1)
    const baseUrl = 'https://avatars2.githubusercontent.com'
    const imageUrl = 'u/59206044'
    const url = utils.getActualImageUrl(baseUrl, imageUrl)
    expect(url).toStrictEqual(
      'https://avatars2.githubusercontent.com/u/59206044'
    )
  })

  it("adds base url if image url doesn't start with a http", () => {
    expect.assertions(1)
    const baseUrl = 'https://avatars2.githubusercontent.com/'
    const imageUrl = 'u/59206044'
    const url = utils.getActualImageUrl(baseUrl, imageUrl)
    expect(url).toStrictEqual(baseUrl + imageUrl)
  })

  it('returns the same image url if provided image url is full', () => {
    expect.assertions(1)
    const baseUrl = 'https://github.com/flyerhq/'
    const imageUrl = 'https://avatars2.githubusercontent.com/u/59206044'
    const url = utils.getActualImageUrl(baseUrl, imageUrl)
    expect(url).toStrictEqual(imageUrl)
  })
})

describe('getHtmlEntitiesDecodedText', () => {
  it('returns undefined if text is not provided', () => {
    expect.assertions(1)
    const decodedText = utils.getHtmlEntitiesDecodedText()
    expect(decodedText).toBeUndefined()
  })

  it('decodes HTML entities', () => {
    expect.assertions(1)
    const text = 'text'
    const decodedText = utils.getHtmlEntitiesDecodedText(text)
    expect(decodedText).toStrictEqual(text)
  })
})

describe('getContent', () => {
  it('returns undefined if neither left nor right is equal to type', () => {
    expect.assertions(1)
    const content = utils.getContent('left', 'right', 'type')
    expect(content).toBeUndefined()
  })

  it('returns right if left is equal to type', () => {
    expect.assertions(1)
    const left = 'left'
    const right = 'right'
    const content = utils.getContent(left, right, left)
    expect(content).toStrictEqual(right)
  })
})

describe('getImageSize', () => {
  it('gets image size', () => {
    expect.assertions(2)
    const getSizeMock = jest.spyOn(Image, 'getSize')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getSizeMock.mockImplementation(() => {})
    const imageUrl = 'https://avatars2.githubusercontent.com/u/59206044'
    utils.getImageSize(imageUrl)
    expect(getSizeMock).toHaveBeenCalledTimes(1)
    const getSizeArgs = getSizeMock.mock.calls[0]
    expect(getSizeArgs[0]).toBe(imageUrl)
    const success = getSizeArgs[1]
    const error = getSizeArgs[2]
    act(() => {
      success(460, 460)
    })
    act(() => {
      error(new Error())
    })
    getSizeMock.mockRestore()
  })
})

describe('oneOf', () => {
  it('returns a truthy param', () => {
    expect.assertions(1)
    const param = utils.oneOf(() => 'truthy', 'falsy')()
    expect(param).toStrictEqual('truthy')
  })

  it('returns a falsy param', () => {
    expect.assertions(1)
    const param = utils.oneOf(undefined, 'falsy')()
    expect(param).toStrictEqual('falsy')
  })
})
