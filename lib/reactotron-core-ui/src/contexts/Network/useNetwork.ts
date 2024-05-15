import { useReducer, useEffect } from "react"

import type { CommandTypeKey } from "reactotron-core-contract"

export enum NetworkStorageKey {
  ReversedOrder = "ReactotronNetworkReversedOrder",
  HiddenCommands = "ReactotronNetworkHiddenCommands",
}

interface NetworkState {
  isSearchOpen: boolean
  search: string
  isFilterOpen: boolean
  isReversed: boolean
  hiddenCommands: CommandTypeKey[]
}

enum NetworkActionType {
  SearchOpen = "SEARCH_OPEN",
  SearchClose = "SEARCH_CLOSE",
  SearchSet = "SEARCH_SET",
  OrderReverse = "ORDER_REVERSE",
  OrderRegular = "ORDER_REGULAR",
}

type Action =
  | {
      type:
        | NetworkActionType.SearchOpen
        | NetworkActionType.SearchClose
        | NetworkActionType.OrderReverse
        | NetworkActionType.OrderRegular
    }
  | {
      type: NetworkActionType.SearchSet
      payload: string
    }

function networkReducer(state: NetworkState, action: Action) {
  switch (action.type) {
    case NetworkActionType.SearchOpen:
      return { ...state, isSearchOpen: true }
    case NetworkActionType.SearchClose:
      return { ...state, isSearchOpen: false }
    case NetworkActionType.SearchSet:
      return { ...state, search: action.payload }
    case NetworkActionType.OrderReverse:
      return { ...state, isReversed: true }
    case NetworkActionType.OrderRegular:
      return { ...state, isReversed: false }
    default:
      return state
  }
}

function useNetwork() {
  const [state, dispatch] = useReducer(networkReducer, {
    isSearchOpen: false,
    search: "",
    isFilterOpen: false,
    isReversed: false,
    hiddenCommands: [],
  })

  // Load some values
  useEffect(() => {
    const isReversed = localStorage.getItem(NetworkStorageKey.ReversedOrder) === "reversed"
    dispatch({
      type: isReversed ? NetworkActionType.OrderReverse : NetworkActionType.OrderRegular,
    })
  }, [])

  // Setup event handlers
  const toggleSearch = () => {
    dispatch({
      type: state.isSearchOpen ? NetworkActionType.SearchClose : NetworkActionType.SearchOpen,
    })
  }

  const openSearch = () => {
    dispatch({
      type: NetworkActionType.SearchOpen,
    })
  }

  const closeSearch = () => {
    dispatch({
      type: NetworkActionType.SearchClose,
    })
  }

  const setSearch = (search: string) => {
    dispatch({
      type: NetworkActionType.SearchSet,
      payload: search,
    })
  }

  const toggleReverse = () => {
    const isReversed = !state.isReversed

    localStorage.setItem(NetworkStorageKey.ReversedOrder, isReversed ? "reversed" : "regular")

    dispatch({
      type: isReversed ? NetworkActionType.OrderReverse : NetworkActionType.OrderRegular,
    })
  }

  return {
    isSearchOpen: state.isSearchOpen,
    toggleSearch,
    openSearch,
    closeSearch,
    search: state.search,
    setSearch,
    isReversed: state.isReversed,
    toggleReverse,
  }
}

export default useNetwork
