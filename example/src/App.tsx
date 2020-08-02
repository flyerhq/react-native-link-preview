import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import UrlPreview from 'react-native-url-preview'

const App = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView>
      <UrlPreview url='https://github.com/flyerhq' />
      <UrlPreview url='https://medium.com/@alexdemchenko/making-a-right-keyboard-accessory-view-in-react-native-8943682fc6a9' />
      <UrlPreview url='https://dev.to/demchenkoalex/making-a-right-keyboard-accessory-view-in-react-native-4n3p' />
    </ScrollView>
  </SafeAreaView>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App
