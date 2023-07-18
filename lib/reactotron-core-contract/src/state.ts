export interface StateBackupRequestPayload {
  state: Record<string, any>
}

export interface StateBackupResponsePayload {
  state: Record<string, any>
}

export interface StateRestoreRequestPayload {
  state: Record<string, any>
}

export interface StateActionDispatchPayload {
  type: string
  payload: Record<string, any>
}

type Path = string

type Value = any

export interface StateKeysRequestPayload {
  path: Path
}

export interface StateKeysResponsePayload {
  path: Path
  keys: string[]
  valid: boolean
}

export interface StateValuesRequestPayload {
  path: Path
}

export interface StateValuesResponsePayload {
  path: Path
  value: Value
  valid: boolean
}

export interface StateValuesChangePayload {
  changes: { path: Path; value: Value }[]
}

export interface StateValuesSubscribePayload {
  paths: Path[]
}

export interface StateActionCompletePayload {
  name: string
  action: Record<string, any>
  ms?: number
}
