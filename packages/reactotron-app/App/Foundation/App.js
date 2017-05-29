import React, { Component } from 'react'
import VisualRoot from './VisualRoot'
import { Provider } from 'mobx-react'
import SessionStore from '../Stores/SessionStore'

const session = new SessionStore()

export default class App extends Component {
  render () {
    return (
      <Provider session={session}>
        <VisualRoot />
      </Provider>
    )
  }
}
