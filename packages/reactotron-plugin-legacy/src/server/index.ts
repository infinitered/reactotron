import { Plugin, messaging } from "reactotron-core-plugin"

import { BackupsResolver } from "./apollo/resolvers"
import { backupsStore } from "./datastore/backupStore"
import * as MessageTypes from "./types"

const plugin = new Plugin()

plugin.addResolver(BackupsResolver).addEventHandler({
  type: "command",
  handler: (command: any) => {
    if (command.type === "state.backup.response") {
      backupsStore.addBackup(command)
      messaging.publish(MessageTypes.BACKUP_ADDED, command)
    }
  },
})

export default plugin
