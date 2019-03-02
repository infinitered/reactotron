import { Reactotron as ReactotronCore } from "reactotron-core-client"

import { UseReactNativeOptions } from "./dist/types/reactotron-react-native";

declare module "reactotron-react-native" {
  export interface Reactotron extends ReactotronCore {
    useReactNative?: (options: UseReactNativeOptions) => Reactotron
    overlay?: (App: React.ReactNode) => void
    storybookSwitcher?: (App: React.ReactNode) => void
  }

  var impl: Reactotron
  export { impl as default }
}
