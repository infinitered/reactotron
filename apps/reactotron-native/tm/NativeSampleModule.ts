import { TurboModule, TurboModuleRegistry } from "react-native"

export interface Spec extends TurboModule {
  readonly reverseString: (input: string) => string
  createServer: () => void
  stopServer: () => void
}

export default TurboModuleRegistry.getEnforcing<Spec>("NativeSampleModule")
