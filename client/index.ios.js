import React, { AppRegistry, Component } from 'react-native'
import ReduxContainer from './App/Containers/ReduxContainer'
import pp from './client'

pp.connect()
pp.log('initialized')

class TestClient extends Component {
  render () {
    return <ReduxContainer />
  }
}

AppRegistry.registerComponent('TestClient', () => TestClient)
