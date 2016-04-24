import Reactotron from '../../client' // in a real app, you would use 'reactotron'
import {Platform} from 'react-native'

Reactotron.connect({
  enabled: true,
  name: 'ReactNativeExample',
  userAgent: Platform.OS
})

