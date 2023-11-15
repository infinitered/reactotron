import React from "react"
import { Provider } from "./contexts"
import { Navigation } from "./navigation"

export function App() {
  return (
    <Provider>
      <Navigation />
    </Provider>
  )
}
