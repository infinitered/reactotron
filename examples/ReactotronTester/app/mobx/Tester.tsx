import React, { Component } from "react"
import { Provider } from "mobx-react"

import AllTheTestingThings from "./MobxTester"
import createRootStore from "./store"

const rootStore = createRootStore()

export default class Tester extends Component {
  render() {
    return (
      <Provider rootStore={rootStore}>
        <AllTheTestingThings />
      </Provider>
    )
  }
}
