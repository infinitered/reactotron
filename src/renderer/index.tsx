import React from "react"
import { render } from "react-dom"
import { ReactotronProvider } from "reactotron-core-ui"

import "./global.css"

import App from "./App"

render(
  <ReactotronProvider>
    <App />
  </ReactotronProvider>,
  document.getElementById("app")
)

if ((module as any).hot) {
  ;(module as any).hot.accept()
}
