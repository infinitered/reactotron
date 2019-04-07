import React, { Component } from "react"
import { Provider } from "react-redux"

import createStore from "./store"
import AllTheTestingThings from "./ReduxTester"

const store = createStore()

export default class Tester extends Component {
  render() {
    return (
      <Provider store={store}>
        <AllTheTestingThings />
      </Provider>
    )
  }
}
