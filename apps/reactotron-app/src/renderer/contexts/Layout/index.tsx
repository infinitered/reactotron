import React from "react"

import useLayout from "./useLayout"

interface Context {
  isSideBarOpen: boolean
  toggleSideBar: () => void
}

const noop = (): void => {
  throw Error(
    "Noop function called. This is a bug. Please report it to the Reactotron team. Thanks! :)"
  )
}

const LayoutContext = React.createContext<Context>({
  isSideBarOpen: true,
  toggleSideBar: noop,
})

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSideBarOpen, toggleSideBar } = useLayout()

  return (
    <LayoutContext.Provider
      value={{
        isSideBarOpen,
        toggleSideBar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export default LayoutContext
export const LayoutProvider = Provider
