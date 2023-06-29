declare module "react-native/Libraries/LogBox/Data/parseLogBoxLog" {
  import type { ExceptionData } from "react-native/Libraries/Core/NativeExceptionsManager";
  /**
   * @see https://github.com/facebook/react-native/blob/330639f74018cfeda28e74c6dae8110d97603860/packages/react-native/Libraries/LogBox/Data/parseLogBoxLog.js#L52-L56
   */
  export interface ExtendedExceptionData extends ExceptionData {
    isComponentError: boolean;
  }
}
