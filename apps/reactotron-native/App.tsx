import React from "react"
import { useColorScheme } from "react-native"
import { TamaguiProvider } from "tamagui"
import { Navigation } from "./navigation"
import config from "./tamagui.config"

export function App() {
  const scheme = useColorScheme()
  return (
    <TamaguiProvider config={config} defaultTheme={scheme === "dark" ? "dark" : "light"}>
      <Navigation />
    </TamaguiProvider>
  )
}
