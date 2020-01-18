import React, { FunctionComponent } from "react"
import { CommandType } from "reactotron-core-ui"
import useReactotron from "./useReactotron"

// TODO: Move up to better places like core somewhere!
export interface Command {
  id: number
  type: CommandType
  connectionId: number
  clientId?: string
  date: Date
  deltaTime: number
  important: boolean
  messageId: number
  payload: any
}

interface Props {
  commands: Command[]
}

interface ContextProps extends Props {
  // Dispatch Modal
  isDispatchModalOpen: boolean
  dispatchModalInitialAction: string
  openDispatchModal: (initialAction: string) => void
  closeDispatchModal: () => void
}

const ReactotronContext = React.createContext<ContextProps>({
  commands: [],
  isDispatchModalOpen: false,
  dispatchModalInitialAction: "",
  openDispatchModal: null,
  closeDispatchModal: null,
})

const Provider: FunctionComponent<Props> = ({ commands, children }) => {
  const {
    isDispatchModalOpen,
    dispatchModalInitialAction,
    openDispatchModal,
    closeDispatchModal,
  } = useReactotron()

  return (
    <ReactotronContext.Provider
      value={{
        commands,
        isDispatchModalOpen,
        dispatchModalInitialAction,
        openDispatchModal,
        closeDispatchModal,
      }}
    >
      {children}
    </ReactotronContext.Provider>
  )
}

export default ReactotronContext
export const ReactotronProvider = Provider
