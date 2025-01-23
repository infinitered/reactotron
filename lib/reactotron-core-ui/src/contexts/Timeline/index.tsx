import React, { FunctionComponent } from "react"

import type { CommandTypeKey } from "reactotron-core-contract"

import useTimeline from "./useTimeline"

interface Context {
  isSearchOpen: boolean
  toggleSearch: () => void
  openSearch: () => void
  closeSearch: () => void
  downloadLog: (commands: any[]) => void
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
  openSearch: null,
  closeSearch: null,
  downloadLog: null,
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
    openSearch,
    closeSearch,
    search,
    setSearch,
    isFilterOpen,
    openFilter,
    closeFilter,
    isReversed,
    toggleReverse,
    hiddenCommands,
    setHiddenCommands,
    downloadLog,
  } = useTimeline()

  return (
    <TimelineContext.Provider
      value={{
        isSearchOpen,
        toggleSearch,
        openSearch,
        closeSearch,
        downloadLog,
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
