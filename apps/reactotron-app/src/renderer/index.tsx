import React from "react"
import { render } from "react-dom"
import { ReactotronAppProvider } from "reactotron-core-ui"

import "./global.css"

import App from "./App"

render(
  <ReactotronAppProvider>
    <App />
  </ReactotronAppProvider>,
  document.getElementById("app")
)

if ((module as any).hot) {
  ;(module as any).hot.accept()
}
