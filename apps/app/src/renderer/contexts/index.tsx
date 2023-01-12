import React, { PropsWithChildren } from "react"
import { LayoutProvider } from "./Layout"
import { StandaloneProvider } from "./Standalone"

const RootContextProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <LayoutProvider>
      <StandaloneProvider>{children}</StandaloneProvider>
    </LayoutProvider>
  )
}

export default RootContextProvider
