import * as React from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import ReactUrlPreview from 'react-native-url-preview'
import styles from './styles'

const App = () => (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.content}>
      <ReactUrlPreview url={'https://www.github.com/'} />
      <ReactUrlPreview url={'https://www.netflix.com/'} />
      <ReactUrlPreview url={'https://www.facebook.com/'} />
      <ReactUrlPreview url={'https://www.linkedin.com/feed/'} />
    </ScrollView>
  </SafeAreaView>
)

export default App
