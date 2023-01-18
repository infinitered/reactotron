import React, { Component } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Provider } from "react-redux"

import createStore from "./store"
import AllTheTestingThings from "./ReduxTester"

const store = createStore()

export default class Tester extends Component {
  componentDidMount() {
    AsyncStorage.setItem("Test", "This")
  }

  render() {
    return (
      <Provider store={store}>
        <AllTheTestingThings />
      </Provider>
    )
  }
}
