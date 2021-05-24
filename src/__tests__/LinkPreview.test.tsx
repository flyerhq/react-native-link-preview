import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'

import { LinkPreview } from '../LinkPreview'
import * as utils from '../utils'

describe('link preview', () => {
  it('does nothing on press if no url is detected', async () => {
    expect.assertions(1)
    const openUrlMock = jest.spyOn(Linking, 'openURL')
    const { getByRole } = render(<LinkPreview text='' />)
    const button = getByRole('button')
    fireEvent.press(button)
    expect(openUrlMock).not.toHaveBeenCalled()
    openUrlMock.mockRestore()
  })

  it('opens url on button press', async () => {
    expect.assertions(1)
    const link = 'https://github.com/flyerhq/'
    const getPreviewDataMock = jest
      .spyOn(utils, 'getPreviewData')
      .mockResolvedValue({
        description: 'description',
        image: {
          height: 460,
          url: 'https://avatars2.githubusercontent.com/u/59206044',
          width: 460,
        },
        link,
        title: 'title',
      })
    const openUrlMock = jest.spyOn(Linking, 'openURL')
    const { getByRole, getByText } = render(<LinkPreview text={link} />)
    await waitFor(() => getByText(link))
    const button = getByRole('button')
    fireEvent.press(button)
    expect(openUrlMock).toHaveBeenCalledWith(link)
    getPreviewDataMock.mockRestore()
    openUrlMock.mockRestore()
  })

  it('renders image node', async () => {
    expect.assertions(1)
    const link = 'https://github.com/flyerhq/'
    const { getByRole, getByText } = render(
      <LinkPreview
        previewData={{
          image: {
            height: 544,
            url: 'https://miro.medium.com/max/1192/1*B3W_-JWSramkIs4MCCz3NA.png',
            width: 1192,
          },
          link,
        }}
        text={link}
      />
    )
    await waitFor(() => getByText(link))
    const image = getByRole('image')
    expect(image.props).toHaveProperty('style.aspectRatio', 1192 / 544)
  })

  it('responses to the layout event change', async () => {
    expect.assertions(1)
    const link = 'https://github.com/flyerhq/'
    const { getByRole, getByText } = render(
      <LinkPreview
        previewData={{
          image: {
            height: 460,
            url: 'https://avatars2.githubusercontent.com/u/59206044',
            width: 460,
          },
          link,
        }}
        text={link}
      />
    )
    await waitFor(() => getByText(link))
    const container = getByRole('button').children[0] as ReactTestInstance
    fireEvent(container, 'layout', {
      nativeEvent: {
        layout: {
          width: 300,
        },
      },
    })
    const image = getByRole('image')
    expect(image.props).toHaveProperty('style.width', 300)
  })
})
