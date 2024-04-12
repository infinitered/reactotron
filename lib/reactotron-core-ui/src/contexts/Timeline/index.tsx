import React, { FunctionComponent } from "react"

import type { CommandTypeKey } from "reactotron-core-contract"

import useTimeline from "./useTimeline"

interface Context {
  isSearchOpen: boolean
  toggleSearch: () => void
  search: string
  setSearch: (search: string) => void
  isFilterOpen: boolean
  openFilter: () => void
  closeFilter: () => void
  isReversed: boolean
  toggleReverse: () => void
  hiddenCommands: CommandTypeKey[]
  setHiddenCommands: (commandTypes: CommandTypeKey[]) => void
}

const TimelineContext = React.createContext<Context>({
  isSearchOpen: false,
  toggleSearch: null,
  search: "",
  setSearch: null,
  isFilterOpen: false,
  openFilter: null,
  closeFilter: null,
  isReversed: false,
  toggleReverse: null,
  hiddenCommands: [],
  setHiddenCommands: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  const {
    isSearchOpen,
    toggleSearch,
    search,
    setSearch,
    isFilterOpen,
    openFilter,
    closeFilter,
    isReversed,
    toggleReverse,
    hiddenCommands,
    setHiddenCommands,
  } = useTimeline()

  return (
    <TimelineContext.Provider
      value={{
        isSearchOpen,
        toggleSearch,
        search,
        setSearch,
        isFilterOpen,
        openFilter,
        closeFilter,
        isReversed,
        toggleReverse,
        hiddenCommands,
        setHiddenCommands,
      }}
    >
      {children}
    </TimelineContext.Provider>
  )
}

export default TimelineContext
export const TimelineProvider = Provider
