import { LinkPreview } from '@flyerhq/react-native-link-preview'
import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'

const App = () => (
  <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      <LinkPreview
        containerStyle={styles.previewContainer}
        text='https://github.com/flyerhq'
      />
      <LinkPreview
        containerStyle={styles.previewContainer}
        text='https://dev.to/demchenkoalex/making-a-right-keyboard-accessory-view-in-react-native-4n3p'
      />
      <LinkPreview
        containerStyle={styles.previewContainer}
        text='https://medium.com/@alexdemchenko/making-a-right-keyboard-accessory-view-in-react-native-8943682fc6a9'
      />
    </ScrollView>
  </SafeAreaView>
)

const styles = StyleSheet.create({
  container: {
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
