import { LinkPreview } from '@flyerhq/react-native-link-preview'
import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'

const App = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <LinkPreview
        containerStyle={styles.previewContainer}
        text='https://flyer.chat'
      />
      <LinkPreview
        containerStyle={styles.previewContainer}
        text='https://github.com/flyerhq'
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
