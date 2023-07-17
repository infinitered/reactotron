export interface ErrorStackFrame {
  fileName: string
  functionName: string
  lineNumber: number
  columnNumber: number | null
}

export const isErrorStackFrame = (value: unknown): value is ErrorStackFrame =>
  value &&
  typeof value === "object" &&
  "fileName" in value &&
  typeof value.fileName === "string" &&
  "functionName" in value &&
  typeof value.functionName === "string" &&
  "lineNumber" in value &&
  typeof value.lineNumber === "number" &&
  ("columnNumber" in value
    ? value.columnNumber === null || typeof value.columnNumber === "number"
    : true)

export const isErrorStackFrameArray = (value: unknown): value is ErrorStackFrame[] =>
  Array.isArray(value) && value.every(isErrorStackFrame)

export interface ErrorLogPayload {
  level: "error"
  message: string
  stack: Error["stack"] | string[] | ErrorStackFrame[]
}

export type LogPayload =
  | {
      level: "debug"
      message: string
    }
  | {
      level: "warn"
      message: string
    }
  | ErrorLogPayload
