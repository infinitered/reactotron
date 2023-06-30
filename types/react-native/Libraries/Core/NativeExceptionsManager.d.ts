declare module "react-native/Libraries/Core/NativeExceptionsManager" {
  /**
   * @see https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/Core/NativeExceptionsManager.js#L17-L23
   */
  export interface StackFrame {
    column?: number;
    file?: string;
    lineNumber?: number;
    methodName: string;
    collapse?: boolean;
  }
  /**
   * @see https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/Core/NativeExceptionsManager.js#L24-L35
   */
  export interface ExceptionData {
    message: string;
    originalMessage?: string;
    name?: string;
    componentStack?: string;
    stack: Array<StackFrame>;
    id: number;
    isFatal: boolean;
    extraData?: object;
  }
}
