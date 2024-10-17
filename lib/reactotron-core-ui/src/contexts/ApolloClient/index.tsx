import React, { FunctionComponent } from "react"

import useApolloClient from "./useApolloClient"

interface Context {
  isSearchOpen: boolean
  toggleSearch: () => void
  openSearch: () => void
  closeSearch: () => void
  search: string
  setSearch: (search: string) => void
}

const ApolloClientContext = React.createContext<Context>({
  isSearchOpen: false,
  toggleSearch: null,
  openSearch: null,
  closeSearch: null,
  search: "",
  setSearch: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  const { isSearchOpen, toggleSearch, openSearch, closeSearch, search, setSearch } =
    useApolloClient()

  return (
    <ApolloClientContext.Provider
      value={{
        isSearchOpen,
        toggleSearch,
        openSearch,
        closeSearch,
        search,
        setSearch,
      }}
    >
      {children}
    </ApolloClientContext.Provider>
  )
}

export default ApolloClientContext
export const ApolloClientProvider = Provider
