import React from "react"
import { createRoot } from "react-dom/client"
import { ReactotronAppProvider } from "reactotron-core-ui"
import { store } from "./util/store";



import "./global.css"

import App from "./App"

const root = createRoot(document.getElementById("app"))

store.init().then(() => {
  root.render(
    <ReactotronAppProvider>
      <App />
    </ReactotronAppProvider>
  )
})