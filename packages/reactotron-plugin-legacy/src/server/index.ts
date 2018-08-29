import { BackupsResolver } from "./apollo/resolvers"
import { backupsStore } from "./datastore/backupStore"
import { messaging, MessageTypes, setMessenger } from "./messaging"

const resolvers = [BackupsResolver]

const eventHandlers = [
  {
    type: "command",
    handler: (command: any) => {
      if (command.type === "state.backup.response") {
        backupsStore.addBackup(command)
        messaging.publish(MessageTypes.BACKUP_ADDED, command)
      }
    },
  },
]

export { resolvers, eventHandlers, setMessenger }
