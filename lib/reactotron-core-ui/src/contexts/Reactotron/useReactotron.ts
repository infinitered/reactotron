import { useReducer, useCallback } from "react"

interface ReactotronState {
  isDispatchModalOpen: boolean
  dispatchModalInitialAction: string
  isSubscriptionModalOpen: boolean
  isDiagnosticModalOpen: boolean
}

enum ReactotronActionType {
  DispatchModalOpen = "DISPATCH_OPEN",
  DispatchModalClose = "DISPATCH_CLOSE",
  SubscriptionModalOpen = "SUBSCRIPTION_OPEN",
  SubscriptionModalClose = "SUBSCRIPTION_CLOSE",
  DiagnosticModalOpen = "DIAGNOSTIC_OPEN",
  DiagnosticModalClose = "DIAGNOSTIC_CLOSE",
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
      case ReactotronActionType.DiagnosticModalOpen:
        return {
          ...state,
          isDiagnosticModalOpen: true,
        }
      case ReactotronActionType.DiagnosticModalClose:
        return {
          ...state,
          isDiagnosticModalOpen: false,
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
    isDiagnosticModalOpen: false,
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

  const openDiagnosticModal = useCallback(() => {
    dispatch({
      type: ReactotronActionType.DiagnosticModalOpen,
    })
  }, [])

  const closeDiagnosticModal = useCallback(() => {
    dispatch({
      type: ReactotronActionType.DiagnosticModalClose,
    })
  }, [])

  return {
    isDispatchModalOpen: state.isDispatchModalOpen,
    isDiagnosticModalOpen: state.isDiagnosticModalOpen,
    dispatchModalInitialAction: state.dispatchModalInitialAction,
    openDispatchModal,
    closeDispatchModal,
    isSubscriptionModalOpen: state.isSubscriptionModalOpen,
    openSubscriptionModal,
    closeSubscriptionModal,
    openDiagnosticModal,
    closeDiagnosticModal
  }
}

export default useReactotron
