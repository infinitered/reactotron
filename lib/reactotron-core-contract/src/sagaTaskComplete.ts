export interface SagaTaskCompleteChild {
  depth: number
  /** Human-readable description of what the saga effect does */
  description: string
  duration: number
  effectId: number
  /** The input parameters/data for the effect - can be any value from saga middleware */
  extra: any
  name: string
  parentEffectId: number
  /** The output/return value from the effect - can be actions, API responses, computed values, etc. */
  result: any
  status: string
  /** Data about the winning branch in a race() effect, null for non-race effects */
  winner: any
  /** Truthy if this effect lost a race() or was cancelled, null otherwise */
  loser: any
}

export interface SagaTaskCompletePayload {
  children: SagaTaskCompleteChild[]
  /** Human-readable description of what triggered the saga, may be undefined */
  description?: string
  duration: number
  triggerType: string
}
