export interface DifferenceCreate {
  type: "CREATE"
  path: (string | number)[]
  value: any
}
export interface DifferenceRemove {
  type: "REMOVE"
  path: (string | number)[]
  oldValue: any
}
export interface DifferenceChange {
  type: "CHANGE"
  path: (string | number)[]
  value: any
  oldValue: any
}
export type Difference = DifferenceCreate | DifferenceRemove | DifferenceChange
