export interface Command {
  clientId?: string
  connectionId: number
  date: Date
  deltaTime: number
  important: boolean
  messageId: number
  payload: any
  type: string
}

