import React, { AppRegistry, Component } from 'react-native'
import ReduxContainer from './App/Containers/ReduxContainer'
import repl from './client'

repl.connect()
repl.log('initialized')

class TestClient extends Component {
  render () {
    return <ReduxContainer />
  }
}

AppRegistry.registerComponent('TestClient', () => TestClient)
