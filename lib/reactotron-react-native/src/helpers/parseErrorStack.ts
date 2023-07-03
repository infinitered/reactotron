// eslint-disable-next-line import/namespace
import type { StackFrame } from "react-native/Libraries/Core/NativeExceptionsManager"
import type { HermesParsedStack } from "react-native/Libraries/Core/Devtools/parseHermesStack"

// Fixing react-native/Libraries/Core/Devtools/symbolicateStackTrace
// since the native type definitions are wrong lol

/** @see https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/Core/Devtools/parseErrorStack.js#L41-L57 */
export type ParseErrorStackFn = <T extends any[]>(
  errorStack?: string | T | HermesParsedStack
) => Array<StackFrame>
