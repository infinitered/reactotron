import * as path from "path"
import * as fs from "fs"
import { Plugin, EventHandler } from "reactotron-core-plugin"

import { messaging } from "../messaging"
import { Command } from "../schema"

export class PluginManager {
  resolvers: Function[] = []
  uiScripts: string[] = []

  private commandHandlers: Function[] = []

  loadPlugins() {
    // TODO: Consider allowing config to give us an alternative (or additional?) base dir
    const baseDir = process.cwd()

    const plugins = this.findPlugins(path.join(baseDir, "node_modules"))

    plugins.forEach(this.loadPlugin)
  }

  onCommand(command: Command) {
    // TODO: Consider making commands register for specific command types and only sending those types. Might cause a bit of a lag in processing commands with a large number of handlers
    // TODO: Also consider not doing this at all since plugins and subscribe to command messages via the Messenger!
    this.commandHandlers.forEach(handler => handler(command))
  }

  getUiScripts() {
    // TODO: Someday figure out how we are going to attach on scripts to the UI
    return "<script>console.log('hello from getUiScripts()');</script>";
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

    const plugin: Plugin = require(path.join(pluginPath, packageJson.plugin)).default

    this.registerSchema(plugin.getResolvers())
    this.registerEventHandlers(plugin.getEventHandlers())
    this.setupMessaging(plugin.setMessenger)
  }

  private registerSchema(resolvers?: Function[]) {
    if (resolvers) {
      this.resolvers.push(...resolvers)
    }
  }

  private registerEventHandlers(handlers?: EventHandler[]) {
    if (handlers) {
      handlers.forEach(handler => {
        if (handler.type === "command") {
          // TODO: An Enum maybe? We would need to allow the plugin to get it too...
          this.commandHandlers.push(handler.handler)
        }
      })
    }
  }

  private setupMessaging(setMessenger?: Function) {
    if (setMessenger) {
      setMessenger(messaging)
    }
  }
}

export const pluginManager = new PluginManager()
