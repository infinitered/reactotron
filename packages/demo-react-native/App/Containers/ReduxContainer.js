import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../Store/Store'
import RootContainer from './RootContainer'

const store = configureStore()

export default class ReduxContainer extends Component {
  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}
