import React from "react"
import ReactDOM from "react-dom"

interface Props {}

class Main extends React.Component<Props> {
  render() {
    return <div>I am reactotron version 3</div>
  }
}

var mountNode = document.getElementById("root")
ReactDOM.render(<Main />, mountNode)
