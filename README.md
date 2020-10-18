# React Native Link Preview

[![npm](https://img.shields.io/npm/v/@flyerhq/react-native-link-preview)](https://www.npmjs.com/package/@flyerhq/react-native-link-preview)
[![build](https://github.com/flyerhq/react-native-link-preview/workflows/build/badge.svg)](https://github.com/flyerhq/react-native-link-preview/actions?query=workflow%3Abuild)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&suffix=%&query=$.typeCoverage.is&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fflyerhq%2Freact-native-link-preview%2Fmain%2Fpackage.json)](https://github.com/plantain-00/type-coverage)

Fully customizable preview of the link extracted from the provided text.

<img src="https://user-images.githubusercontent.com/14123304/96363230-41ceac80-1133-11eb-9a8a-d1360d3aebc6.png" width="320" height="693">

## Getting Started

```sh
yarn add @flyerhq/react-native-link-preview
```

## Usage

```ts
import { LinkPreview } from '@flyerhq/react-native-link-preview'
// ...
return (
  <LinkPreview text='This link https://github.com/flyerhq can be extracted from the text' />
)
```

## Props

### Required

| Name | Type   | Description                   |
| ---- | ------ | ----------------------------- |
| text | string | Text to extract the link from |

### Optional

| Name                          | Type                                                                                       | Description                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| containerStyle                | [ViewStyle](https://reactnative.dev/docs/view-style-props)                                 | Top level container style                                    |
| metadataContainerStyle        | [ViewStyle](https://reactnative.dev/docs/view-style-props)                                 | Title, description and minimized image container style       |
| metadataTextContainerStyle    | [ViewStyle](https://reactnative.dev/docs/view-style-props)                                 | Title and description container style                        |
| onPreviewDataFetched          | (PreviewData) => void                                                                      | Callback to get the fetched preview data                     |
| previewData                   | PreviewData                                                                                | Data to render instead of parsing the provided text          |
| renderDescription             | (string) => ReactNode                                                                      | Custom description render prop                               |
| renderImage                   | (PreviewDataImage) => ReactNode                                                            | Custom image render prop                                     |
| renderLinkPreview             | ({ aspectRatio?: number, containerWidth: number, previewData?: PreviewData }) => ReactNode | Custom render prop                                           |
| renderMinimizedImage          | (PreviewDataImage) => ReactNode                                                            | Custom minimised image render prop                           |
| renderText                    | (string) => ReactNode                                                                      | Custom provided text render prop                             |
| renderTitle                   | (string) => ReactNode                                                                      | Custom title render prop                                     |
| textContainerStyle            | [ViewStyle](https://reactnative.dev/docs/view-style-props)                                 | Text, title, description and minimized image container style |
| touchableWithoutFeedbackProps | TouchableWithoutFeedbackProps                                                              | Top level touchable props                                    |

## License

[MIT](LICENSE)
