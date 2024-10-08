import React, { FunctionComponent } from "react"

import useNetwork from "./useNetwork"

interface Context {
  isSearchOpen: boolean
  toggleSearch: () => void
  openSearch: () => void
  closeSearch: () => void
  search: string
  setSearch: (search: string) => void
  isReversed: boolean
  toggleReverse: () => void
}

const NetworkContext = React.createContext<Context>({
  isSearchOpen: false,
  toggleSearch: null,
  openSearch: null,
  closeSearch: null,
  search: "",
  setSearch: null,
  isReversed: false,
  toggleReverse: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  const {
    isSearchOpen,
    toggleSearch,
    openSearch,
    closeSearch,
    search,
    setSearch,
    isReversed,
    toggleReverse,
  } = useNetwork()

  return (
    <NetworkContext.Provider
      value={{
        isSearchOpen,
        toggleSearch,
        openSearch,
        closeSearch,
        search,
        setSearch,
        isReversed,
        toggleReverse,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export default NetworkContext
export const NetworkProvider = Provider
