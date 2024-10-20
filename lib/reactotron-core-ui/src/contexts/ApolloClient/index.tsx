import React, { FunctionComponent } from "react"

import useApolloClient, { ApolloClientData, INITIAL_DATA } from "./useApolloClient"

interface Context {
  isSearchOpen: boolean
  toggleSearch: () => void
  openSearch: () => void
  closeSearch: () => void
  search: string
  setSearch: (search: string) => void
  viewedKeys: string[]
  setViewedKeys: (viewedKey: string) => void
  currentIndex: number
  setCurrentIndex: (currentIndex: number) => void
  getCurrentKey: () => string | null
  goForward: () => void
  goBack: () => void
  togglePin: (key: string) => void
  pinnedKeys: string[]
  data: ApolloClientData
  setData: (data: ApolloClientData) => void
}

const ApolloClientContext = React.createContext<Context>({
  isSearchOpen: false,
  toggleSearch: null,
  openSearch: null,
  closeSearch: null,
  search: "",
  setSearch: null,
  viewedKeys: [],
  setViewedKeys: null,
  currentIndex: -1,
  setCurrentIndex: null,
  getCurrentKey: null,
  goForward: null,
  goBack: null,
  togglePin: null,
  pinnedKeys: [],
  data: INITIAL_DATA,
  setData: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  const {
    isSearchOpen,
    toggleSearch,
    openSearch,
    closeSearch,
    search,
    setSearch,
    setViewedKeys,
    viewedKeys,
    currentIndex,
    setCurrentIndex,
    getCurrentKey,
    goBack,
    goForward,
    togglePin,
    pinnedKeys,
    data,
    setData,
  } = useApolloClient()

  return (
    <ApolloClientContext.Provider
      value={{
        isSearchOpen,
        toggleSearch,
        openSearch,
        closeSearch,
        search,
        setSearch,
        viewedKeys,
        setViewedKeys,
        currentIndex,
        setCurrentIndex,
        getCurrentKey,
        goBack,
        goForward,
        togglePin,
        pinnedKeys,
        data,
        setData,
      }}
    >
      {children}
    </ApolloClientContext.Provider>
  )
}

export default ApolloClientContext
export const ApolloClientProvider = Provider
