import { Request, Response } from "express"
import { PluginManager } from "../pluginManager"

/**
 * The endpoint which will return the JS to be injected into the
 * reactotron app.
 */
export function createInjectPluginsEndpoint(pluginManager: PluginManager) {
  // handle the request
  return function(req: Request, res: Response) {
    res.send(pluginManager.getUiScripts())
  }
}
