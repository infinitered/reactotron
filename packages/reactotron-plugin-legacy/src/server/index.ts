import { Plugin, Messenger } from "reactotron-core-plugin"

import { BackupsResolver } from "./apollo/backups"
import { StateSubscriptionsResolver } from "./apollo/stateSubscriptions"
import { backupsStore } from "./datastore/backupStore"
import * as MessageTypes from "./types"
import { StateSubscriptionsStore } from "./datastore/stateSubscriptionStore";

const plugin = new Plugin()

plugin.addResolver(BackupsResolver, StateSubscriptionsResolver).addEventHandler({
  type: "command",
  handler: (command: any) => {
    if (command.type === "state.backup.response") {
      backupsStore.addBackup(command)
      Messenger.publish(MessageTypes.BACKUP_ADDED, command)
    }

    if (command.type === "state.values.change") {
      StateSubscriptionsStore.updateSubscription(command)
    }
  },
})

export default plugin
