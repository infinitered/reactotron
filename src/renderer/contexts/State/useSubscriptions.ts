import { useReducer, useEffect, useCallback } from "react"

enum StorageKey {
  Subscriptions = "ReactotronSubscriptions",
}

interface State {
  subscriptions: string[]
}

interface Action {
  type: "SUBSCRIPTIONS_SET"
  payload?: string | string[]
}

function subscriptionsReducer(state: State, action: Action) {
  switch (action.type) {
    case "SUBSCRIPTIONS_SET":
      return { ...state, subscriptions: action.payload as string[] }
    default:
      return state
  }
}

function useSubscriptions(onSendCommand: (type: string, payload: any) => void) {
  const [state, dispatch] = useReducer(subscriptionsReducer, {
    subscriptions: [],
  })

  // Internal Handlers
  const sendSubscriptions = useCallback(
    (subscriptions: string[]) => {
      localStorage.setItem(StorageKey.Subscriptions, JSON.stringify(subscriptions))

      onSendCommand("state.values.subscribe", { paths: subscriptions })
    },
    [onSendCommand]
  )

  // Load up saved subscriptions!
  useEffect(() => {
    const subscriptions = JSON.parse(localStorage.getItem(StorageKey.Subscriptions) || "[]")

    dispatch({
      type: "SUBSCRIPTIONS_SET",
      payload: subscriptions,
    })

    if (subscriptions.length === 0) return

    sendSubscriptions(subscriptions)
  }, [sendSubscriptions])

  // Setup event handlers
  const addSubscription = (path: string) => {
    if (state.subscriptions.indexOf(path) > -1) return

    const newSubscriptions = [...state.subscriptions, path]

    sendSubscriptions(newSubscriptions)

    dispatch({
      type: "SUBSCRIPTIONS_SET",
      payload: newSubscriptions,
    })
  }

  const removeSubscription = (path: string) => {
    const idx = state.subscriptions.indexOf(path)

    const newSubscriptions = [
      ...state.subscriptions.slice(0, idx),
      ...state.subscriptions.slice(idx + 1),
    ]

    sendSubscriptions(newSubscriptions)

    dispatch({
      type: "SUBSCRIPTIONS_SET",
      payload: newSubscriptions,
    })
  }

  const clearSubscriptions = () => {
    sendSubscriptions([])

    dispatch({
      type: "SUBSCRIPTIONS_SET",
      payload: [],
    })
  }

  return {
    subscriptions: state.subscriptions,
    addSubscription,
    removeSubscription,
    clearSubscriptions,
  }
}

export default useSubscriptions
