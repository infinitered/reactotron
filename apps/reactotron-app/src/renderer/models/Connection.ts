import { type Instance, t, type SnapshotIn } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const ConnectionModel = t
  .model({
    // Stuff shipped from core-server
    id: t.number,
    clientId: t.string,

    platform: t.enumeration(["ios", "android", "browser"] as const),
    name: "",
    platformVersion: t.optional(t.union(t.number, t.string), ""),
    osRelease: "",
    userAgent: "",

    commands: t.array(t.frozen<any>()),
    connected: false,
  })
  .actions(withSetPropAction)
  .actions((connection) => ({
    addCommand(command: any) {
      connection.commands.push(command)
    },
    clearCommands() {
      connection.commands.clear()
    },
  }))

export type Connection = Instance<typeof ConnectionModel>
export type ConnectionSnapshot = SnapshotIn<typeof ConnectionModel>
