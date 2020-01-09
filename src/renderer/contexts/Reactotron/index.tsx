import React, { FunctionComponent } from "react"
import { CommandType } from "reactotron-core-ui"

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

const ReactotronContext = React.createContext<Props>({
  commands: [],
})

const Provider: FunctionComponent<Props> = ({ commands, children }) => {
  return <ReactotronContext.Provider value={{ commands }}>{children}</ReactotronContext.Provider>
}

export default ReactotronContext
export const ReactotronProvider = Provider
