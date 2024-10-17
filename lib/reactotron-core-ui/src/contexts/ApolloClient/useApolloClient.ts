import { useReducer } from "react"

// export enum StorageKey {
//   ReversedOrder = "ReactotronApolloClientReversedOrder",
//   HiddenCommands = "ReactotronApolloClientHiddenCommands",
// }

interface ApolloClientState {
  isSearchOpen: boolean
  search: string
  // isFilterOpen: boolean
  // isReversed: boolean
  // hiddenCommands: CommandTypeKey[]
}

enum ApolloClientActionType {
  SearchOpen = "SEARCH_OPEN",
  SearchClose = "SEARCH_CLOSE",
  SearchSet = "SEARCH_SET",
  // FilterOpen = "FILTER_OPEN",
  // FilterClose = "FILTER_CLOSE",
  // OrderReverse = "ORDER_REVERSE",
  // OrderRegular = "ORDER_REGULAR",
  // HiddenCommandsSet = "HIDDENCOMMANDS_SET",
}

type Action =
  | {
      type: ApolloClientActionType.SearchOpen | ApolloClientActionType.SearchClose
      // | ApolloClientActionType.FilterOpen
      // | ApolloClientActionType.FilterClose
      // | ApolloClientActionType.OrderReverse
      // | ApolloClientActionType.OrderRegular
    }
  | {
      type: ApolloClientActionType.SearchSet
      payload: string
    }
// | {
//     type: ApolloClientActionType.HiddenCommandsSet
//     payload: CommandTypeKey[]
//   }

function ApolloClientReducer(state: ApolloClientState, action: Action) {
  switch (action.type) {
    case ApolloClientActionType.SearchOpen:
      return { ...state, isSearchOpen: true }
    case ApolloClientActionType.SearchClose:
      return { ...state, isSearchOpen: false }
    case ApolloClientActionType.SearchSet:
      return { ...state, search: action.payload }
    // case ApolloClientActionType.FilterOpen:
    //   return { ...state, isFilterOpen: true }
    // case ApolloClientActionType.FilterClose:
    //   return { ...state, isFilterOpen: false }
    // case ApolloClientActionType.OrderReverse:
    //   return { ...state, isReversed: true }
    // case ApolloClientActionType.OrderRegular:
    //   return { ...state, isReversed: false }
    // case ApolloClientActionType.HiddenCommandsSet:
    //   return { ...state, hiddenCommands: action.payload }
    default:
      return state
  }
}

function useApolloClient() {
  const [state, dispatch] = useReducer(ApolloClientReducer, {
    isSearchOpen: false,
    search: "",
    // isFilterOpen: false,
    // isReversed: false,
    // hiddenCommands: [],
  })

  // Load some values
  // useEffect(() => {
  //   const isReversed = localStorage.getItem(StorageKey.ReversedOrder) === "reversed"
  //   const hiddenCommands = JSON.parse(localStorage.getItem(StorageKey.HiddenCommands) || "[]")

  //   dispatch({
  //     type: isReversed ? ApolloClientActionType.OrderReverse : ApolloClientActionType.OrderRegular,
  //   })

  //   dispatch({
  //     type: ApolloClientActionType.HiddenCommandsSet,
  //     payload: hiddenCommands,
  //   })
  // }, [])

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

  const setSearch = (search: string) => {
    dispatch({
      type: ApolloClientActionType.SearchSet,
      payload: search,
    })
  }

  // const openFilter = () => {
  //   dispatch({
  //     type: ApolloClientActionType.FilterOpen,
  //   })
  // }

  // const closeFilter = () => {
  //   dispatch({
  //     type: ApolloClientActionType.FilterClose,
  //   })
  // }

  // const toggleReverse = () => {
  //   const isReversed = !state.isReversed

  //   localStorage.setItem(StorageKey.ReversedOrder, isReversed ? "reversed" : "regular")

  //   dispatch({
  //     type: isReversed ? ApolloClientActionType.OrderReverse : ApolloClientActionType.OrderRegular,
  //   })
  // }

  // const setHiddenCommands = (hiddenCommands: CommandTypeKey[]) => {
  //   localStorage.setItem(StorageKey.HiddenCommands, JSON.stringify(hiddenCommands))

  //   dispatch({
  //     type: ApolloClientActionType.HiddenCommandsSet,
  //     payload: hiddenCommands,
  //   })
  // }

  return {
    isSearchOpen: state.isSearchOpen,
    toggleSearch,
    openSearch,
    closeSearch,
    search: state.search,
    setSearch,
    // isFilterOpen: state.isFilterOpen,
    // openFilter,
    // closeFilter,
    // isReversed: state.isReversed,
    // toggleReverse,
    // hiddenCommands: state.hiddenCommands,
    // setHiddenCommands,
  }
}

export default useApolloClient
