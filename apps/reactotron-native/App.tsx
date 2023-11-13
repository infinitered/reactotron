import React from "react"
import { TamaguiProvider } from "tamagui"
import { Navigation } from "./navigation"
import config from "./tamagui.config"

export function App() {
  return (
    <TamaguiProvider config={config}>
      <Navigation />
    </TamaguiProvider>
  )
}
