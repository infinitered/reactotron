import { TurboModule, TurboModuleRegistry } from "react-native"

export type ServerOptions = {
  host?: string
  port?: number
  threads?: number
}

export interface Spec extends TurboModule {
  createServer: (options: ServerOptions) => void
  stopServer: () => void
  doSomething: () => void
}

export default TurboModuleRegistry.getEnforcing<Spec>("NativeWebsocketModule")
