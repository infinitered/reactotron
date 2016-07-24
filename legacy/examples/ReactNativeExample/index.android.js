// imported from a file to ensure the connect statement gets run first!
import './App/Config/ReactotronConfig'
import React, { AppRegistry, Component } from 'react-native'
import ReduxContainer from './App/Containers/ReduxContainer'

class ReactNativeExample extends Component {
  render () {
    return <ReduxContainer />
  }
}

AppRegistry.registerComponent(
  'ReactNativeExample',
  () => ReactNativeExample
)
