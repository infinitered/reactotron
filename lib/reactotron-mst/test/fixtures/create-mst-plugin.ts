import type { Reactotron } from "reactotron-core-client"
import { mst, type MstPluginOptions } from "../../src/reactotron-mst"
import { createMockReactotron } from "../mocks/create-mock-reactotron"

/**
 * Creates an reactotron-mst plugin with a mocked reactotron.
 */
export function createMstPlugin(pluginOptions: MstPluginOptions = {}) {
  const reactotron = createMockReactotron()
  const plugin = mst(pluginOptions)(reactotron as unknown as Reactotron)
  const track = plugin.features.trackMstNode

  return { reactotron, plugin, track }
}
