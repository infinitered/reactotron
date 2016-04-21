import React, { AppRegistry, Component } from 'react-native'
import ReduxContainer from './Native/Containers/ReduxContainer'
import reactotron from './reactotron/client'

reactotron.connect()

class TestClient extends Component {
  render () {
    return <ReduxContainer />
  }
}

AppRegistry.registerComponent('TestClient', () => TestClient)
