import { useReducer, useCallback } from "react"

interface ReactotronState {
  isDispatchModalOpen: boolean
  dispatchModalInitialAction: string
  isSubscriptionModalOpen: boolean
}

enum ReactotronActionType {
  DispatchModalOpen = "DISPATCH_OPEN",
  DispatchModalClose = "DISPATCH_CLOSE",
  SubscriptionModalOpen = "SUBSCRIPTION_OPEN",
  SubscriptionModalClose = "SUBSCRIPTION_CLOSE",
}

interface ReactotronAction {
  type: ReactotronActionType
  payload?: string
}

function reactotronReducer(state: ReactotronState, action: ReactotronAction) {
  switch (action.type) {
    case ReactotronActionType.DispatchModalOpen:
      return {
        ...state,
        isDispatchModalOpen: true,
        dispatchModalInitialAction: action.payload || "",
      }
    case ReactotronActionType.DispatchModalClose:
      return {
        ...state,
        isDispatchModalOpen: false,
      }
    case ReactotronActionType.SubscriptionModalOpen:
      return {
        ...state,
        isSubscriptionModalOpen: true,
      }
    case ReactotronActionType.SubscriptionModalClose:
      return {
        ...state,
        isSubscriptionModalOpen: false,
      }
    default:
      return state
  }
}

function useReactotron() {
  const [state, dispatch] = useReducer(reactotronReducer, {
    isDispatchModalOpen: false,
    dispatchModalInitialAction: "",
    isSubscriptionModalOpen: false,
  })

  const openDispatchModal = useCallback((intiialAction: string) => {
    dispatch({
      type: ReactotronActionType.DispatchModalOpen,
      payload: intiialAction,
    })
  }, [])

  const closeDispatchModal = useCallback(() => {
    dispatch({
      type: ReactotronActionType.DispatchModalClose,
    })
  }, [])

  const openSubscriptionModal = useCallback(() => {
    dispatch({
      type: ReactotronActionType.SubscriptionModalOpen,
    })
  }, [])

  const closeSubscriptionModal = useCallback(() => {
    dispatch({
      type: ReactotronActionType.SubscriptionModalClose,
    })
  }, [])

  return {
    isDispatchModalOpen: state.isDispatchModalOpen,
    dispatchModalInitialAction: state.dispatchModalInitialAction,
    openDispatchModal,
    closeDispatchModal,
    isSubscriptionModalOpen: state.isSubscriptionModalOpen,
    openSubscriptionModal,
    closeSubscriptionModal,
  }
}

export default useReactotron
