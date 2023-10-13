import React from "react"
import { LayoutProvider } from "./Layout"
import { StandaloneProvider } from "./Standalone"

const RootContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutProvider>
      <StandaloneProvider>{children}</StandaloneProvider>
    </LayoutProvider>
  )
}

export default RootContextProvider
