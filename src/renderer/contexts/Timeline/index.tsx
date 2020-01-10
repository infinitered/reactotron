import React, { FunctionComponent } from "react"
import { CommandType } from "reactotron-core-ui"

import useTimeline from "./useTimeline"

interface Context {
  isSearchOpen: boolean
  toggleSearch: () => void
  search: string
  setSearch: (search: string) => void
  isFilterOpen: boolean
  openFilter: () => void
  closeFilter: () => void
  isDispatchOpen: boolean
  dispatchInitialAction: string
  openDispatch: () => void
  closeDispatch: () => void
  isReversed: boolean
  toggleReverse: () => void
  hiddenCommands: CommandType[]
  setHiddenCommands: (commandTypes: CommandType[]) => void
}

const TimelineContext = React.createContext<Context>({
  isSearchOpen: false,
  toggleSearch: null,
  search: "",
  setSearch: null,
  isFilterOpen: false,
  openFilter: null,
  closeFilter: null,
  isDispatchOpen: false,
  dispatchInitialAction: "",
  openDispatch: null,
  closeDispatch: null,
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
    isDispatchOpen,
    dispatchInitialAction,
    openDispatch,
    closeDispatch,
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
        isDispatchOpen,
        dispatchInitialAction,
        openDispatch,
        closeDispatch,
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
