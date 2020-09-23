import { UrlPreview } from '@flyerhq/react-native-url-preview'
import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'

const App = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView>
      <UrlPreview text='https://mrowka-bagazowka.pl/' />
      <UrlPreview
        text='Hello this is an example of the ParsedText, links like http://www.facebook.com are clickable and phone number 444-555-6666 can call too.  http://www.google.com or
          But you can also do more with this package, for example Bob will change style and David too. foo@gmail.com
          And the magic number is 42!
          #react #react-native'
      />
      <UrlPreview text='https://twitter.com/hashtag/Israel?src=hash&amp;ref_src=twsrc%5Etfw' />
      <UrlPreview text='https://github.com/flyerhq' />
      <UrlPreview text='https://medium.com/@alexdemchenko/making-a-right-keyboard-accessory-view-in-react-native-8943682fc6a9' />
      <UrlPreview text='https://dev.to/demchenkoalex/making-a-right-keyboard-accessory-view-in-react-native-4n3p' />
    </ScrollView>
  </SafeAreaView>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App
