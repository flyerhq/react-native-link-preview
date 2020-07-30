import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  containerStyle: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 239, 244, 0.52)',
  },
  imageStyle: {
    borderRadius: 8,
    width: '100%',
    height: 240,
    marginBottom: 8,
  },
  noImageStyle: {
    borderRadius: 8,
    width: '100%',
    height: 240,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: 8,
  },
  noImageTextStyle: {
    textAlign: 'center',
    color: '#5d6383',
  },
  siteTitle: {
    fontFamily: 'Helvetica-Bold',
  },
  titleStyle: {
    fontSize: 16,
    color: '#000',
    marginRight: 10,
    marginBottom: 5,
    alignSelf: 'flex-start',
    fontFamily: 'Helvetica',
  },
  descriptionStyle: {
    fontSize: 14,
    color: '#81848A',
    marginRight: 10,
    alignSelf: 'flex-start',
    fontFamily: 'Helvetica',
  },
  errorText: {
    fontSize: 14,
    color: '#81848A',
    marginRight: 10,
    alignSelf: 'flex-start',
    fontFamily: 'Helvetica',
  },
})
