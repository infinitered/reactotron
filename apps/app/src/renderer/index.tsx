import React from "react"
import { render } from "react-dom"
import { ReactotronAppProvider as _ReactotronAppProvider } from "reactotron-core-ui"

// TODO: add PropsWithChildren type to reactotron-core-ui export
const ReactotronAppProvider = _ReactotronAppProvider as React.FC<React.PropsWithChildren<{}>>

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
