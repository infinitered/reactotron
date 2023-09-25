import { useCallback, useReducer } from "react"
import { produce } from "immer"

export enum ActionTypes {
  ToggleSideBar = "TOGGLE_SIDEBAR",
}

interface State {
  isSideBarOpen: boolean
}

type Action = { type: ActionTypes.ToggleSideBar }

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionTypes.ToggleSideBar:
      return produce(state, draftState => {
        draftState.isSideBarOpen = !draftState.isSideBarOpen
      })
    default:
      return state
  }
}

function useLayout() {
  const [state, dispatch] = useReducer(reducer, {
    isSideBarOpen: true,
  })

  const toggleSideBar = useCallback(() => {
    dispatch({ type: ActionTypes.ToggleSideBar })
  }, [])

  return {
    ...state,
    toggleSideBar,
  }
}

export default useLayout
