# example

## Getting Started

```bash
yarn
```

for iOS:

```bash
npx pod-install
```

To run the app use:

```bash
yarn ios
```

or

```bash
yarn android
```

## Updating project

1. Check if there are major versions of 3rd party dependencies, update and commit these changes first
2. Remove current `example` project
3. Create a project named `example` using [react-native-better-template](https://github.com/demchenkoalex/react-native-better-template)
4. Revert `README.md` so you can see this guide
5. In `tsconfig.json` add

```json
"baseUrl": ".",
"paths": {
  "@flyerhq/react-native-link-preview": ["../src"]
},
```

6. Check the difference in `metro.config.js` and combine all
7. Revert `App.tsx`
8. Open Xcode and change build number from 1 to 2 and back in the UI, so Xcode will format `*.pbxproj` eliminating some changes
