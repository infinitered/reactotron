import React from "react"
import { useColorScheme } from "react-native"
import { TamaguiProvider } from "tamagui"
import config from "../tamagui.config"
import { LayoutProvider } from "./Layout"
import { StandaloneProvider } from "./Standalone"

export function Provider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme()
  return (
    <TamaguiProvider config={config} defaultTheme={scheme === "dark" ? "dark" : "light"}>
      <LayoutProvider>
        <StandaloneProvider>{children}</StandaloneProvider>
      </LayoutProvider>
    </TamaguiProvider>
  )
}
