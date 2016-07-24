// imported from a file to ensure the connect statement gets run first!
import './App/Config/ReactotronConfig'
import React, { AppRegistry, Component } from 'react-native'
import ReduxContainer from './App/Containers/ReduxContainer'

class TestClient extends Component {
  render () {
    return <ReduxContainer />
  }
}

AppRegistry.registerComponent('TestClient', () => TestClient)
AppRegistry.runApplication('TestClient', { rootTag: document.getElementById('react-root') })
