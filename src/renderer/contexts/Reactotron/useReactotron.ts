import { useReducer, useCallback } from "react"

interface ReactotronState {
  isDispatchModalOpen: boolean
  dispatchModalInitialAction: string
}

enum ReactotronActionType {
  DispatchModalOpen = "DISPATCH_OPEN",
  DispatchModalClose = "DISPATCH_CLOSE",
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
    default:
      return state
  }
}

function useReactotron() {
  const [state, dispatch] = useReducer(reactotronReducer, {
    isDispatchModalOpen: false,
    dispatchModalInitialAction: "",
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

  return {
    isDispatchModalOpen: state.isDispatchModalOpen,
    dispatchModalInitialAction: state.dispatchModalInitialAction,
    openDispatchModal,
    closeDispatchModal,
  }
}

export default useReactotron
