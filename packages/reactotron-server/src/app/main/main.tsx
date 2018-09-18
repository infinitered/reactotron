import React from "react"
import ReactDOM from "react-dom"
import { Text } from "reactotron-core-ui"
import { Apollo } from "./apollo"
import { SampleLoadAndSubscribe, SampleLoadOnly, SampleSubscribeOnly } from "./sample-apollo"
import { SectionPicker } from "../sections"

interface Props {}

class Main extends React.Component<Props> {
  render() {
    return (
      <Apollo>
        <div className="min-h-screen flex">
          <SectionPicker value="foo" />
          <div className="pl-4 bg-content flex flex-col flex-1">
            <Text variant="title" tx="reactotron.name" />
            <SampleLoadOnly />
            <SampleSubscribeOnly />
            <SampleLoadAndSubscribe />
          </div>
        </div>
      </Apollo>
    )
  }
}

var mountNode = document.getElementById("root")
ReactDOM.render(<Main />, mountNode)
