import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    backgroundColor: '#4A90E2',
    flex: 1
  },
  content: {},
  titleContainer: {
    flex: 1,
    backgroundColor: '#3B73B5',
    paddingTop: 50,
    paddingBottom: 20,
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFD898'
  },
  errorTitle: {
    paddingTop: 30,
    fontSize: 16,
    textAlign: 'center',
    color: 'white'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff'
  },
  repoContainer: {
    alignItems: 'center'
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20
  }
})
