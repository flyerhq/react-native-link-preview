import { LinkPreview } from '@flyerhq/react-native-link-preview'
import React from 'react'
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  UIManager,
} from 'react-native'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const App = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <LinkPreview
        containerStyle={styles.previewContainer}
        enableAnimation
        text='https://flyer.chat'
      />
      <LinkPreview
        containerStyle={styles.previewContainer}
        enableAnimation
        text='github.com/flyerhq'
      />
    </ScrollView>
  </SafeAreaView>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  previewContainer: {
    backgroundColor: '#f7f7f8',
    borderRadius: 20,
    marginTop: 16,
    overflow: 'hidden',
  },
})

export default App
