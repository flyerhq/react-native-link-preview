import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import LinkPreview from 'link-preview-js'
import React from 'react'
import { Image, Linking, Text } from 'react-native'
import { size } from '../../jest/fixtures'
import { UrlPreview } from '../UrlPreview'

describe('urlPreview', () => {
  it('renders null', () => {
    expect.assertions(1)
    const text = 'https://www.instagram.com/'
    const { queryByText } = render(<UrlPreview text={''} />)
    expect(queryByText(text)).toBeNull()
  })

  it('renders UrlPreview title', () => {
    expect.assertions(1)
    const text = 'https://www.instagram.com/'
    const { getByText } = render(<UrlPreview text={text} />)
    expect(getByText(text)).toBeDefined()
  })

  it('handles link opening', async () => {
    expect.assertions(1)
    const spy = jest.spyOn(Linking, 'openURL')
    const text = 'https://www.instagram.com/'
    const { getByRole } = render(
      <UrlPreview
        text={text}
        touchableWithoutFeedbackProps={{
          accessibilityRole: 'button',
        }}
      />
    )
    const button = getByRole('button')
    fireEvent.press(button)
    await waitFor(() => expect(spy).toHaveBeenCalledWith(text))
    spy.mockRestore()
  })

  it('handles onPreviewPress with invalid link', async () => {
    expect.assertions(1)
    const spy = jest.spyOn(Linking, 'openURL')
    const text = 'Invalid link'
    const { getByRole } = render(
      <UrlPreview
        text={text}
        touchableWithoutFeedbackProps={{
          accessibilityRole: 'button',
        }}
      />
    )
    const button = getByRole('button')
    fireEvent.press(button)
    await waitFor(() => expect(spy).not.toHaveBeenCalled())
    spy.mockRestore()
  })

  it('renders all properties', async () => {
    expect.assertions(7)
    const CONTAINER_WIDTH = 500

    const text = 'https://www.instagram.com/'
    const spy = jest
      .spyOn(LinkPreview, 'getLinkPreview')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockImplementation(() => ({
        description: 'This is amazing website',
        favicons: [],
        images: ['logo.svg', 'image.png'],
        mediaType: 'image',
        title: 'Instagram website',
        url: 'https://www.instagram.com/',
      }))

    const { getByA11yRole, getByText, getByTestId } = render(
      <UrlPreview containerWidth={CONTAINER_WIDTH} text={text} />
    )
    expect(spy).toHaveBeenCalledWith(text, undefined)
    await waitFor(() => getByA11yRole('image'))

    const container = getByTestId('container')
    expect(container).toBeDefined()
    expect(container.props.style.width).toStrictEqual(CONTAINER_WIDTH)

    const image = getByA11yRole('image')
    expect(image).toBeDefined()
    expect(image.props.source.uri).toStrictEqual('image.png')

    expect(getByText('This is amazing website')).toBeDefined()
    expect(getByText('Instagram website')).toBeDefined()

    spy.mockRestore()
  })

  it('throws an error on getLinkPreview', async () => {
    expect.assertions(3)
    const CONTAINER_WIDTH = 500

    const text = 'https://www.instagram.com/'
    const spy = jest
      .spyOn(LinkPreview, 'getLinkPreview')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockRejectedValue(undefined)

    const { queryByText, getByTestId } = render(
      <UrlPreview containerWidth={CONTAINER_WIDTH} text={text} />
    )
    expect(spy).toHaveBeenCalledWith(text, undefined)
    expect(getByTestId('container')).toBeDefined()
    expect(queryByText(text)).toBeDefined()

    spy.mockRestore()
  })

  it('renders without images and favicons', async () => {
    expect.assertions(2)

    const text = 'https://www.instagram.com/'

    const spy = jest
      .spyOn(LinkPreview, 'getLinkPreview')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockImplementation(() => ({
        description: 'This is amazing website',
        mediaType: 'image',
        url: 'https://www.instagram.com/',
      }))

    const { queryByRole } = render(<UrlPreview text={text} />)
    expect(spy).toHaveBeenCalledWith(text, undefined)
    await waitFor(() => queryByRole('image'))
    expect(queryByRole('image')).toBeNull()
    spy.mockRestore()
  })

  it('should render custom elements from props', async () => {
    expect.assertions(7)

    const text = 'https://www.instagram.com/'

    const spy = jest
      .spyOn(LinkPreview, 'getLinkPreview')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockImplementation(() => ({
        description: 'This is amazing website',
        mediaType: 'image',
        images: ['image.png'],
        title: 'INSTApost',
        url: 'https://www.instagram.com/',
      }))

    const { getByA11yLabel } = render(
      <UrlPreview
        renderDescription={(description) => (
          <Text accessibilityLabel='CustomRenderDescription'>
            {description}
          </Text>
        )}
        renderImage={(image) => (
          <Text accessibilityLabel='CustomRenderImage'>{image}</Text>
        )}
        renderTitle={(title) => (
          <Text accessibilityLabel='CustomRenderTitle'>{title}</Text>
        )}
        text={text}
      />
    )
    await waitFor(() => getByA11yLabel('CustomRenderDescription'))
    expect(spy).toHaveBeenCalledWith(text, undefined)
    const description = getByA11yLabel('CustomRenderDescription')
    expect(description).toBeDefined()
    expect(description.props.children).toStrictEqual('This is amazing website')

    const image = getByA11yLabel('CustomRenderImage')
    expect(image).toBeDefined()
    expect(image.props.children).toStrictEqual('image.png')

    const title = getByA11yLabel('CustomRenderTitle')
    expect(title).toBeDefined()
    expect(title.props.children).toStrictEqual('INSTApost')

    spy.mockRestore()
  })

  it('sets proper width on container layout', async () => {
    expect.assertions(1)

    const text = 'https://www.instagram.com/'
    const spy = jest
      .spyOn(LinkPreview, 'getLinkPreview')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockImplementation(() => ({
        description: 'This is amazing website',
        favicons: [],
        images: ['logo.svg', 'image.png'],
        mediaType: 'image',
        title: 'Instagram website',
        url: 'https://www.instagram.com/',
      }))

    const { getByTestId, getByRole } = render(<UrlPreview text={text} />)
    await waitFor(() => getByRole('image'))
    fireEvent(getByTestId('container'), 'layout', {
      nativeEvent: {
        layout: {
          width: 300,
        },
      },
    })

    expect(getByRole('image').props).toHaveProperty('style.width', 300)
    spy.mockRestore()
  })

  it('getSize of image and renders it', async () => {
    expect.assertions(4)

    const text = 'https://www.instagram.com/'

    const getSizeMock = jest
      .spyOn(Image, 'getSize')
      .mockImplementation(jest.fn())

    const spy = jest
      .spyOn(LinkPreview, 'getLinkPreview')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockImplementation(() => ({
        description: 'This is amazing website',
        mediaType: 'image',
        images: ['image.png'],
        title: 'INSTApost',
        url: 'https://www.instagram.com/',
      }))
    const { getByRole } = render(<UrlPreview text={text} />)
    await waitFor(() => getByRole('image'))
    expect(getSizeMock).toHaveBeenCalledTimes(1)

    const getSizeArgs = getSizeMock.mock.calls[0]
    expect(getSizeArgs[0]).toBe('image.png')
    const success = getSizeArgs[1]
    const error = getSizeArgs[2]

    act(() => {
      success(size.width, size.height)
    })
    const successImageComponent = getByRole('image')
    expect(successImageComponent.props).toHaveProperty(
      'style.aspectRatio',
      size.width / size.height
    )

    act(() => {
      error(new Error())
    })
    const errorImageComponent = getByRole('image')
    expect(errorImageComponent.props).toHaveProperty('style.aspectRatio', 1)
    spy.mockRestore()
    getSizeMock.mockRestore()
  })
})
