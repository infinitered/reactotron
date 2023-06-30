declare module "react-native/Libraries/LogBox/Data/parseLogBoxLog" {
  import type { ExceptionData } from "react-native/Libraries/Core/NativeExceptionsManager";
  /**
   * @see https://github.com/facebook/react-native/blob/v0.72.1/packages/react-native/Libraries/LogBox/Data/parseLogBoxLog.js#L26-L29
   */
  export interface ExtendedExceptionData extends ExceptionData {
    isComponentError: boolean;
  }
}
