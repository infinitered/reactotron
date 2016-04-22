import React, { AppRegistry, Component } from 'react-native'
import ReduxContainer from './App/Containers/ReduxContainer'
import reactotron from './client'

reactotron.connect()

class TestClient extends Component {
  render () {
    return <ReduxContainer />
  }
}

AppRegistry.registerComponent('TestClient', () => TestClient)
AppRegistry.runApplication('TestClient', { rootTag: document.getElementById('react-root') })
