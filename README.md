# react-native-url-preview

![Supports Android and iOS](https://img.shields.io/badge/platforms-android%20|%20ios-lightgrey.svg)

**react-native-url-preview** is a package that gives you pretty out of the box and fully customizable representation of provided URL.

## Key Features!

- Easy to style
- Cover both platforms IOS/Android
- Hooks only
- Tests coverage
- No native dependencies

### **Tech**

**react-native-url-preview** uses an open-source project to work properly:

- [link-preview-js](https://www.npmjs.com/package/link-preview-js) - Typescript library that allows you to extract information from a URL or parse text and retrieve information from the first available link.

### **Installation**

```sh
$ yarn add flyerhq/@react-native-url-preview
or
$ npm install flyerhq/@react-native-url-preview
```

### **Example import**

```javascript
import UrlPreview from 'react-native-url-preview'

<UrlPreview url='https://github.com/flyerhq' />
```

### **Common props**

| Name                  | Required | Type                               | Description                                                                              |
| --------------------- | -------- | ---------------------------------- | ---------------------------------------------------------------------------------------- |
| url                   | true     | string                             | Url string to render                                                                     |
| containerStyle        | false    | object                             | Styles of the main container                                                             |
| descriptionProps      | false    | object                             | The text prop controls how description text will look like                               |
| imageProps            | false    | object                             | The image prop controls all properties of the url image component                        |
| siteNameProps         | false    | object                             | The text prop controls all properties of the site name text component                    |
| titleProps            | false    | object                             | The text prop controls all properties of the title text component                        |
| noImageContainerStyle | false    | object                             | The view style prop controls how no image container will look like                       |
| onError               | false    | (error) => void                    | Callback fired if a response can't be parsed or if there was no URL in the text provided |
| onLoadEnd             | false    | (response) => void                 | Callback fired when url parsing is finished successfully                                 |
| renderDescription     | false    | (description?:string) => ReactNode | Callback what receives description string if any and returns description component       |
| renderImage           | false    | (imageUrl?: string) => ReactNode   | Callback what receives image url if any and returns image component                      |
| renderLoader          | false    | () => ReactNode                    | Callback what returns loader component                                                   |
| renderSiteName        | false    | (name?: string) => ReactNode       | Callback what receives site name string if any and returns siteName component            |
| renderTitle           | false    | (title?: string) => ReactNode      | Callback what receives title string if any and returns title component                   |
| urlOptions            | false    | object                             | Add request headers to fetch call                                                        |

### **Development**

Want to contribute? Great!
Please send Your PR for the package and we will consider it ASAP.

### **Todos**

- Write MORE Tests
- Add CI
- Add Night Mode (\*)

## **License**

MIT

**Free Software, Hell Yeah!**
