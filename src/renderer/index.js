import React from "react"
import { render } from "react-dom"

// import App from './App'

render(<div />, document.getElementById("app"))

if (module.hot) {
  module.hot.accept()
}
