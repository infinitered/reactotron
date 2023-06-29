declare module "react-native/Libraries/LogBox/LogBox" {
  import type { ExtendedExceptionData } from "react-native/Libraries/LogBox/Data/parseLogBoxLog";
  /**
   * @see https://github.com/facebook/react-native/blob/330639f74018cfeda28e74c6dae8110d97603860/packages/react-native/Libraries/LogBox/LogBox.js#L21-L22
   */
  interface ILogBox {
    addException: (error: ExtendedExceptionData) => void;
  }

  const LogBox: ILogBox;
  export default LogBox;
}
