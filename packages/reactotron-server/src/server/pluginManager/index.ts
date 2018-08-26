import * as path from "path"
import * as fs from "fs"

import { Command } from "../schema"

class PluginManager {
  resolvers: Function[] = []

  private commandHandlers: Function[] = []

  loadPlugins() {
    // TODO: Consider allowing config to give us an alternative (or additional?) base dir
    const baseDir = process.cwd()

    const plugins = this.findPlugins(path.join(baseDir, "node_modules"))

    plugins.forEach(this.loadPlugin)
  }

  onCommand(command: Command) {
    // TODO: Consider making commands register for specific command types and only sending those types. Might cause a bit of a lag in processing commands with a large number of handlers
    this.commandHandlers.forEach(handler => handler(command))
  }

  private findPlugins(basePath: string) {
    // TODO: Be more safe. Not sure if this can fail too easily
    return fs
      .readdirSync(basePath)
      .filter(name => name.startsWith("reactotron-plugin")) // TODO: Should we really be this forceful?
      .map(name => path.join(basePath, name))
  }

  private loadPlugin = (pluginPath: string) => {
    const configContents = fs.readFileSync(path.join(pluginPath, "package.json"), "utf8")
    const packageJson = JSON.parse(configContents)

    if (!packageJson.plugin) return

    const plugin = require(path.join(pluginPath, packageJson.plugin))

    this.registerSchema(plugin.resolvers)
    this.registerEventHandlers(plugin.eventHandlers)
  }

  private registerSchema(resolvers?: Function[]) {
    if (resolvers) {
      this.resolvers.push(...resolvers)
    }
  }

  private registerEventHandlers(handlers?: { type: "command"; handler: Function }[]) {
    if (handlers) {
      handlers.forEach(handler => {
        if (handler.type === "command") {
          // TODO: An Enum maybe? We would need to allow the plugin to get it too...
          this.commandHandlers.push(handler.handler)
        }
      })
    }
  }
}

const pluginManager = new PluginManager()

export { pluginManager }
