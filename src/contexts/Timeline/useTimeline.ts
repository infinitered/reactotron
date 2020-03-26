import { useReducer, useEffect } from "react"

import { CommandType } from "../../types"

export enum StorageKey {
  ReversedOrder = "ReactotronTimelineReversedOrder",
  HiddenCommands = "ReactotronTimelineHiddenCommands",
}

interface TimelineState {
  isSearchOpen: boolean
  search: string
  isFilterOpen: boolean
  isReversed: boolean
  hiddenCommands: CommandType[]
}

enum TimelineActionType {
  SearchOpen = "SEARCH_OPEN",
  SearchClose = "SEARCH_CLOSE",
  SearchSet = "SEARCH_SET",
  FilterOpen = "FILTER_OPEN",
  FilterClose = "FILTER_CLOSE",
  OrderReverse = "ORDER_REVERSE",
  OrderRegular = "ORDER_REGULAR",
  HiddenCommandsSet = "HIDDENCOMMANDS_SET",
}

type Action =
  | {
      type:
        | TimelineActionType.SearchOpen
        | TimelineActionType.SearchClose
        | TimelineActionType.FilterOpen
        | TimelineActionType.FilterClose
        | TimelineActionType.OrderReverse
        | TimelineActionType.OrderRegular
    }
  | {
      type: TimelineActionType.SearchSet
      payload: string
    }
  | {
      type: TimelineActionType.HiddenCommandsSet
      payload: CommandType[]
    }

function timelineReducer(state: TimelineState, action: Action) {
  switch (action.type) {
    case TimelineActionType.SearchOpen:
      return { ...state, isSearchOpen: true }
    case TimelineActionType.SearchClose:
      return { ...state, isSearchOpen: false }
    case TimelineActionType.SearchSet:
      return { ...state, search: action.payload }
    case TimelineActionType.FilterOpen:
      return { ...state, isFilterOpen: true }
    case TimelineActionType.FilterClose:
      return { ...state, isFilterOpen: false }
    case TimelineActionType.OrderReverse:
      return { ...state, isReversed: true }
    case TimelineActionType.OrderRegular:
      return { ...state, isReversed: false }
    case TimelineActionType.HiddenCommandsSet:
      return { ...state, hiddenCommands: action.payload }
    default:
      return state
  }
}

function useTimeline() {
  const [state, dispatch] = useReducer(timelineReducer, {
    isSearchOpen: false,
    search: "",
    isFilterOpen: false,
    isReversed: false,
    hiddenCommands: [],
  })

  // Load some values
  useEffect(() => {
    const isReversed = localStorage.getItem(StorageKey.ReversedOrder) === "reversed"
    const hiddenCommands = JSON.parse(localStorage.getItem(StorageKey.HiddenCommands) || "[]")

    dispatch({
      type: isReversed ? TimelineActionType.OrderReverse : TimelineActionType.OrderRegular,
    })

    dispatch({
      type: TimelineActionType.HiddenCommandsSet,
      payload: hiddenCommands,
    })
  }, [])

  // Setup event handlers
  const toggleSearch = () => {
    dispatch({
      type: state.isSearchOpen ? TimelineActionType.SearchClose : TimelineActionType.SearchOpen,
    })
  }

  const setSearch = (search: string) => {
    dispatch({
      type: TimelineActionType.SearchSet,
      payload: search,
    })
  }

  const openFilter = () => {
    dispatch({
      type: TimelineActionType.FilterOpen,
    })
  }

  const closeFilter = () => {
    dispatch({
      type: TimelineActionType.FilterClose,
    })
  }

  const toggleReverse = () => {
    const isReversed = !state.isReversed

    localStorage.setItem(StorageKey.ReversedOrder, isReversed ? "reversed" : "regular")

    dispatch({
      type: isReversed ? TimelineActionType.OrderReverse : TimelineActionType.OrderRegular,
    })
  }

  const setHiddenCommands = (hiddenCommands: CommandType[]) => {
    localStorage.setItem(StorageKey.HiddenCommands, JSON.stringify(hiddenCommands))

    dispatch({
      type: TimelineActionType.HiddenCommandsSet,
      payload: hiddenCommands,
    })
  }

  return {
    isSearchOpen: state.isSearchOpen,
    toggleSearch,
    search: state.search,
    setSearch,
    isFilterOpen: state.isFilterOpen,
    openFilter,
    closeFilter,
    isReversed: state.isReversed,
    toggleReverse,
    hiddenCommands: state.hiddenCommands,
    setHiddenCommands,
  }
}

export default useTimeline
