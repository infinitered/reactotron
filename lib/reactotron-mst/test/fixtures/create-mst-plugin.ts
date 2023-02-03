import { mst, MstPluginOptions } from "../../src/reactotron-mst"
import { createMockReactotron } from "../mocks/create-mock-reactotron"

/**
 * Creates an reactotron-mst plugin with a mocked reactotron.
 */
export function createMstPlugin(pluginOptions: MstPluginOptions = {}) {
  const reactotron = createMockReactotron()
  const plugin = mst(pluginOptions)(reactotron)
  const track = plugin.features.trackMstNode

  return { reactotron, plugin, track }
}
