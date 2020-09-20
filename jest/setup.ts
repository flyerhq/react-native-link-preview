jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('link-preview-js', () => ({
  getLinkPreview: jest.fn(),
}))
