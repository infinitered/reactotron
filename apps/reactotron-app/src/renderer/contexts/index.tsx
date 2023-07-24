import React, { PropsWithChildren } from "react"
import { LayoutProvider } from "./Layout"
import { StandaloneProvider } from "./Standalone"

interface Props {}

const RootContextProvider: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  return (
    <LayoutProvider>
      <StandaloneProvider>{children}</StandaloneProvider>
    </LayoutProvider>
  )
}

export default RootContextProvider
