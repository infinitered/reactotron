import React from "react"
import { Provider } from "./contexts"
// import { Navigation } from "./navigation"
import { HomeScreen } from "./screens/HomeScreen"

export function App() {
  return (
    <Provider>
      <HomeScreen />

      {/* <Navigation /> */}
    </Provider>
  )
}
