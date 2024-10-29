import { useCallback, useReducer } from "react"

// export enum StorageKey {
//   ReversedOrder = "ReactotronApolloClientReversedOrder",
//   HiddenCommands = "ReactotronApolloClientHiddenCommands",
// }

export interface ApolloClientData {
  id: string
  lastUpdatedAt: Date
  // cache array of objects
  cache: Record<string, object>
}

interface ApolloClientState {
  isSearchOpen: boolean
  search: string
  viewedKeys: string[]
  currentIndex: number
  pinnedKeys: string[]
  data: ApolloClientData
  isEditOpen: boolean
}

export const INITIAL_DATA = {
  id: "x",
  lastUpdatedAt: new Date(),
  // queries: [],
  // mutations: [],
  cache: {},
}

enum ApolloClientActionType {
  SearchOpen = "SEARCH_OPEN",
  SearchClose = "SEARCH_CLOSE",
  SearchSet = "SEARCH_SET",
  ViewedKeysSet = "VIEWED_KEYS_SET",
  IndexSet = "INDEX_SET",
  PinnedKeysSet = "PINNED_KEYS_SET",
  DataSet = "DATA_SET",
  EditOpen = "EDIT_OPEN",
  EditClose = "EDIT_CLOSE",
}

type Action =
  | {
      type:
        | ApolloClientActionType.SearchOpen
        | ApolloClientActionType.SearchClose
        | ApolloClientActionType.EditOpen
        | ApolloClientActionType.EditClose
    }
  | {
      type: ApolloClientActionType.SearchSet
      payload: string
    }
  | {
      type: ApolloClientActionType.PinnedKeysSet
      payload: string[]
    }
  | {
      type: ApolloClientActionType.IndexSet
      payload: number
    }
  | {
      type: ApolloClientActionType.ViewedKeysSet
      payload: string[]
    }
  | {
      type: ApolloClientActionType.DataSet
      payload: ApolloClientData
    }

function ApolloClientReducer(state: ApolloClientState, action: Action) {
  switch (action.type) {
    case ApolloClientActionType.SearchOpen:
      return { ...state, isSearchOpen: true }
    case ApolloClientActionType.SearchClose:
      return { ...state, isSearchOpen: false }
    case ApolloClientActionType.EditClose:
      return { ...state, isEditOpen: false }
    case ApolloClientActionType.EditOpen:
      return { ...state, isEditOpen: true }
    case ApolloClientActionType.SearchSet:
      return { ...state, search: action.payload }
    case ApolloClientActionType.ViewedKeysSet:
      return { ...state, viewedKeys: action.payload, currentIndex: action.payload.length - 1 }
    case ApolloClientActionType.IndexSet:
      return { ...state, currentIndex: action.payload }
    case ApolloClientActionType.PinnedKeysSet:
      return { ...state, pinnedKeys: action.payload }
    case ApolloClientActionType.DataSet:
      return { ...state, data: action.payload }
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
    pinnedKeys: [],
    data: INITIAL_DATA,
    isEditOpen: false,
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

  const openEdit = useCallback(() => {
    dispatch({
      type: ApolloClientActionType.EditOpen,
    })
  }, [])

  const closeEdit = useCallback(() => {
    dispatch({
      type: ApolloClientActionType.EditClose,
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

  const togglePin = useCallback(
    (key: string) => {
      const newPinnedKeys = state.pinnedKeys.includes(key)
        ? state.pinnedKeys.filter((k) => k !== key)
        : [...state.pinnedKeys, key]
      dispatch({
        type: ApolloClientActionType.PinnedKeysSet,
        payload: newPinnedKeys,
      })
    },
    [state.pinnedKeys]
  )

  const setData = useCallback((data: ApolloClientData) => {
    dispatch({
      type: ApolloClientActionType.DataSet,
      payload: data,
    })
  }, [])

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
    togglePin,
    pinnedKeys: state.pinnedKeys,
    data: state.data,
    setData,
    openEdit,
    closeEdit,
    isEditOpen: state.isEditOpen,
  }

  return contextValue
}

export default useApolloClient
