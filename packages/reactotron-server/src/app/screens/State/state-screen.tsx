import React from "react"
import { JsonTree } from "reactotron-core-ui"

const TEMP_DATA = {
  root: {
    temp: "Hello",
    deeper: {
      another: "level",
    },
  },
}

export class StateScreen extends React.Component {
  render() {
    return <JsonTree data={TEMP_DATA} />
  }
}
