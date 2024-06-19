import { TurboModule, TurboModuleRegistry } from "react-native"

export interface Spec extends TurboModule {
  createServer: () => void
  stopServer: () => void
  doSomething: () => void
}

export default TurboModuleRegistry.getEnforcing<Spec>("NativeWebsocketModule")
