import React, { Component } from 'react'
import Root from './Root'
import { Provider } from 'react-redux'
import configureStore from './Store/Store'

const store = configureStore()

export default class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    )
  }
}
