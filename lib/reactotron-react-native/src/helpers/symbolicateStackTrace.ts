// The actual type definitions are wrong, so we are fixing them lol
// eslint-disable-next-line import/namespace
import type { StackFrame } from "react-native/Libraries/Core/NativeExceptionsManager"

/** @see https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/Core/Devtools/symbolicateStackTrace.js#L17-L25 */
export type CodeFrame = Readonly<{
  content: string
  location:
    | {
        row: number
        column: number
      }
    | null
    | undefined
  fileName: string
}>

/** @see https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/Core/Devtools/symbolicateStackTrace.js#L27-L30 */
export type SymbolicatedStackTrace = Readonly<{
  stack: Array<StackFrame>
  codeFrame: CodeFrame | null | undefined
}>

/** @see https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/Core/Devtools/symbolicateStackTrace.js#L32-L34 */
export type SymbolicateStackTraceFn = (stack: Array<StackFrame>) => Promise<SymbolicatedStackTrace>
