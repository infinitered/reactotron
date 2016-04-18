import React, { AppRegistry, Component } from 'react-native'
import ReduxContainer from './App/Containers/ReduxContainer'
import puppeteer from './client'

puppeteer.connect()

class TestClient extends Component {
  render () {
    return <ReduxContainer />
  }
}

AppRegistry.registerComponent('TestClient', () => TestClient)
