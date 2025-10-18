export interface CustomCommandRegisterPayload {
  id: number
  command: string
  title?: string
  description?: string
  args?: Array<{
    name: string
    type: string
  }>
}

export interface CustomCommandUnregisterPayload {
  id: number
  command: string
}
