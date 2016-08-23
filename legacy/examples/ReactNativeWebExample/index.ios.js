import React, { AppRegistry, Component } from 'react-native'
import ReduxContainer from './App/Containers/ReduxContainer'
import Reactotron from './client' // in a real app, you would use 'reactotron'

Reactotron.connect()

class ReactNativeExample extends Component {
  render () {
    return <ReduxContainer />
  }
}

AppRegistry.registerComponent(
  'ReactNativeExample',
  () => ReactNativeExample
)
