import { useCallback, useReducer } from "react"

// export enum StorageKey {
//   ReversedOrder = "ReactotronApolloClientReversedOrder",
//   HiddenCommands = "ReactotronApolloClientHiddenCommands",
// }

interface ApolloClientState {
  isSearchOpen: boolean
  search: string
  viewedKeys: string[]
  currentIndex: number
}

enum ApolloClientActionType {
  SearchOpen = "SEARCH_OPEN",
  SearchClose = "SEARCH_CLOSE",
  SearchSet = "SEARCH_SET",
  ViewedKeysSet = "VIEWED_KEYS_SET",
  IndexSet = "INDEX_SET",
}

type Action =
  | {
      type: ApolloClientActionType.SearchOpen | ApolloClientActionType.SearchClose
    }
  | {
      type: ApolloClientActionType.SearchSet
      payload: string
    }
  | {
      type: ApolloClientActionType.IndexSet
      payload: number
    }
  | {
      type: ApolloClientActionType.ViewedKeysSet
      payload: string[]
    }

function ApolloClientReducer(state: ApolloClientState, action: Action) {
  switch (action.type) {
    case ApolloClientActionType.SearchOpen:
      return { ...state, isSearchOpen: true }
    case ApolloClientActionType.SearchClose:
      return { ...state, isSearchOpen: false }
    case ApolloClientActionType.SearchSet:
      return { ...state, search: action.payload }
    case ApolloClientActionType.ViewedKeysSet:
      return { ...state, viewedKeys: action.payload, currentIndex: action.payload.length - 1 }
    case ApolloClientActionType.IndexSet:
      return { ...state, currentIndex: action.payload }
    default:
      return state
  }
}

function useApolloClient() {
  const [state, dispatch] = useReducer(ApolloClientReducer, {
    isSearchOpen: false,
    search: "",
    viewedKeys: [],
    currentIndex: -1,
  })

  // Setup event handlers
  const toggleSearch = useCallback(() => {
    dispatch({
      type: state.isSearchOpen
        ? ApolloClientActionType.SearchClose
        : ApolloClientActionType.SearchOpen,
    })
  }, [state.isSearchOpen])

  const openSearch = useCallback(() => {
    dispatch({
      type: ApolloClientActionType.SearchOpen,
    })
  }, [])

  const closeSearch = useCallback(() => {
    dispatch({
      type: ApolloClientActionType.SearchClose,
    })
  }, [])

  const setSearch = useCallback((search: string) => {
    dispatch({
      type: ApolloClientActionType.SearchSet,
      payload: search,
    })
  }, [])

  const goBack = useCallback(() => {
    if (state.currentIndex > 0) {
      dispatch({
        type: ApolloClientActionType.IndexSet,
        payload: state.currentIndex - 1,
      })
    }
  }, [state.currentIndex])

  const goForward = useCallback(() => {
    if (state.currentIndex < state.viewedKeys.length - 1) {
      dispatch({
        type: ApolloClientActionType.IndexSet,
        payload: state.currentIndex + 1,
      })
    }
  }, [state.currentIndex, state.viewedKeys])

  const setViewedKeys = useCallback(
    (viewedKey: string) => {
      if (
        state.viewedKeys.length === 0 ||
        state.viewedKeys[state.viewedKeys.length - 1] !== viewedKey
      ) {
        // const newHistory = state.viewedKeys.slice(0, state.currentIndex + 1) // Safely trims the history if needed
        // newHistory.push(viewedKey)
        const newHistory = [...state.viewedKeys, viewedKey]
        dispatch({
          type: ApolloClientActionType.ViewedKeysSet,
          payload: newHistory,
        })

        dispatch({
          type: ApolloClientActionType.IndexSet,
          payload: newHistory.length - 1,
        })
      }
    },
    [state.viewedKeys]
  )

  const setCurrentIndex = useCallback((index: number) => {
    dispatch({
      type: ApolloClientActionType.IndexSet,
      payload: index,
    })
  }, [])

  const getCurrentKey = useCallback(() => {
    return state.currentIndex >= 0 ? state.viewedKeys[state.currentIndex] : null
  }, [state.currentIndex, state.viewedKeys])

  const contextValue = {
    isSearchOpen: state.isSearchOpen,
    toggleSearch,
    openSearch,
    closeSearch,
    search: state.search,
    setSearch,
    viewedKeys: state.viewedKeys,
    setViewedKeys,
    setCurrentIndex,
    currentIndex: state.currentIndex,
    getCurrentKey,
    goForward,
    goBack,
  }

  return contextValue
}

export default useApolloClient
