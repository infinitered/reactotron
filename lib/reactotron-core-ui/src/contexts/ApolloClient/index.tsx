import React, { FunctionComponent } from "react"

import useApolloClient, { ApolloClientData, INITIAL_DATA } from "./useApolloClient"
import ReactotronContext from "../Reactotron"
import { CommandType } from "reactotron-core-contract"

interface Context {
  isSearchOpen: boolean
  toggleSearch: () => void
  openSearch: () => void
  closeSearch: () => void
  search: string
  setSearch: (search: string) => void
  viewedKeys: string[]
  setViewedKeys: (viewedKey: string) => void
  currentIndex: number
  setCurrentIndex: (currentIndex: number) => void
  getCurrentKey: () => string | null
  goForward: () => void
  goBack: () => void
  togglePin: (key: string) => void
  pinnedKeys: string[]
  data: ApolloClientData
  setData: (data: ApolloClientData) => void
  isEditOpen: boolean
  openEdit: () => void
  closeEdit: () => void
}

const ApolloClientContext = React.createContext<Context>({
  isSearchOpen: false,
  toggleSearch: null,
  openSearch: null,
  closeSearch: null,
  search: "",
  setSearch: null,
  viewedKeys: [],
  setViewedKeys: null,
  currentIndex: -1,
  setCurrentIndex: null,
  getCurrentKey: null,
  goForward: null,
  goBack: null,
  togglePin: null,
  pinnedKeys: [],
  data: INITIAL_DATA,
  setData: null,
  isEditOpen: false,
  openEdit: null,
  closeEdit: null,
})

const Provider: FunctionComponent<any> = ({ children }) => {
  const {
    isSearchOpen,
    toggleSearch,
    openSearch,
    closeSearch,
    search,
    setSearch,
    setViewedKeys,
    viewedKeys,
    currentIndex,
    setCurrentIndex,
    getCurrentKey,
    goBack,
    goForward,
    togglePin,
    pinnedKeys,
    data,
    setData,
    isEditOpen,
    openEdit,
    closeEdit,
  } = useApolloClient()
  const { sendCommand, addCommandListener } = React.useContext(ReactotronContext)
  const lastQueryKeys = React.useRef<Set<string> | null>(null)

  // send polling apollo.request command every half second
  React.useEffect(() => {
    const interval = setInterval(() => {
      sendCommand("apollo.request", {})
    }, 1000)
    return () => clearInterval(interval)
  }, [sendCommand])

  React.useEffect(() => {
    addCommandListener((command) => {
      if (command.type === CommandType.ApolloClientResponse) {
        // TODO diff the payload for new queries by name, maybe log to timeline?
        const newQueries = diffAndLogNewQueries(lastQueryKeys.current, command.payload.queries)
        console.log({ newQueries })
        if (newQueries) {
          newQueries.forEach((queryIndex) => {
            const query = command.payload.queries[queryIndex]
            sendCommand(CommandType.Display, {
              name: "Apollo Client",
              preview: `Query: ${query.name}`,
              value: { variables: query.variables, queryString: query.queryString },
            })
          })
          lastQueryKeys.current = new Set(newQueries)
        }
        // console.log({ newQueries, allQueries: command.payload.queries })

        // TODO diff for subscriptions

        // TODO reorder the way things come in so recent is at top ?
        console.log(command.payload)
        setData(command.payload)
        sendCommand("apollo.ack", {})
      }
    })
  }, [addCommandListener, sendCommand, setData])

  return (
    <ApolloClientContext.Provider
      value={{
        isSearchOpen,
        toggleSearch,
        openSearch,
        closeSearch,
        search,
        setSearch,
        viewedKeys,
        setViewedKeys,
        currentIndex,
        setCurrentIndex,
        getCurrentKey,
        goBack,
        goForward,
        togglePin,
        pinnedKeys,
        data,
        setData,
        isEditOpen,
        openEdit,
        closeEdit,
      }}
    >
      {children}
    </ApolloClientContext.Provider>
  )
}

export default ApolloClientContext
export const ApolloClientProvider = Provider

function diffAndLogNewQueries(lastQueryKeys: Set<string> | null, currentQueries: Map<any, any>) {
  const currentQueryKeys = new Set(currentQueries.keys())

  const newQueries = []
  if (lastQueryKeys) {
    // Determine new queries by comparing keys
    currentQueryKeys.forEach((key) => {
      if (!lastQueryKeys.has(key)) {
        newQueries.push(key)
      }
    })

    // Log new queries
    if (newQueries.length > 0) {
      console.log("New Queries:", newQueries, lastQueryKeys)
      // return newQueries
    } else {
      console.log("No new queries since last check.")
    }
  } else {
    console.log("Initial query tracking setup.")
    currentQueryKeys.forEach((key) => {
      newQueries.push(key)
    })
  }

  // Update the last known set of query keys
  return newQueries
}
