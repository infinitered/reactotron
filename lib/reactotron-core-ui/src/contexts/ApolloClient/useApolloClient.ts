import { useReducer } from "react"

// export enum StorageKey {
//   ReversedOrder = "ReactotronApolloClientReversedOrder",
//   HiddenCommands = "ReactotronApolloClientHiddenCommands",
// }

interface ApolloClientState {
  isSearchOpen: boolean
  search: string
  cacheKey: string
}

enum ApolloClientActionType {
  SearchOpen = "SEARCH_OPEN",
  SearchClose = "SEARCH_CLOSE",
  SearchSet = "SEARCH_SET",
  CacheKeySet = "CACHE_KEY_SET",
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
      type: ApolloClientActionType.CacheKeySet
      payload: string
    }

function ApolloClientReducer(state: ApolloClientState, action: Action) {
  switch (action.type) {
    case ApolloClientActionType.SearchOpen:
      return { ...state, isSearchOpen: true }
    case ApolloClientActionType.SearchClose:
      return { ...state, isSearchOpen: false }
    case ApolloClientActionType.SearchSet:
      return { ...state, search: action.payload }
    case ApolloClientActionType.CacheKeySet:
      return { ...state, cacheKey: action.payload }
    default:
      return state
  }
}

function useApolloClient() {
  const [state, dispatch] = useReducer(ApolloClientReducer, {
    isSearchOpen: false,
    search: "",
    cacheKey: "",
  })

  // Setup event handlers
  const toggleSearch = () => {
    dispatch({
      type: state.isSearchOpen
        ? ApolloClientActionType.SearchClose
        : ApolloClientActionType.SearchOpen,
    })
  }

  const openSearch = () => {
    dispatch({
      type: ApolloClientActionType.SearchOpen,
    })
  }

  const closeSearch = () => {
    dispatch({
      type: ApolloClientActionType.SearchClose,
    })
  }

  const setCacheKey = (cacheKey: string) => {
    dispatch({
      type: ApolloClientActionType.SearchSet,
      payload: cacheKey,
    })
  }

  const setSearch = (search: string) => {
    dispatch({
      type: ApolloClientActionType.SearchSet,
      payload: search,
    })
  }

  return {
    isSearchOpen: state.isSearchOpen,
    toggleSearch,
    openSearch,
    closeSearch,
    search: state.search,
    setSearch,
    setCacheKey,
    cacheKey: state.cacheKey,
  }
}

export default useApolloClient
