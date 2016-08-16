// imported from a file to ensure the connect statement gets run first!
import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import './App/Config/ReactotronConfig'
import ReduxContainer from './App/Containers/ReduxContainer'

class DemoReactNative extends Component {
  render () {
    return <ReduxContainer />
  }
}

AppRegistry.registerComponent(
  'DemoReactNative',
  () => DemoReactNative
)
