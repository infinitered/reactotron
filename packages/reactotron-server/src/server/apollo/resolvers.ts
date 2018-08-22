import { connections, commands } from "../datastore"
import { messaging, MessageTypes } from '../messaging'

export default {
  Subscription: {
    connectionsUpdated: {
      subscribe: () => messaging.asyncIterator([MessageTypes.CONNECTION_ESTABLISHED, MessageTypes.CONNECTION_DISCONNECTED])
    },
    commandAdded: {
      subscribe: () => messaging.asyncIterator([MessageTypes.COMMAND_ADDED])
    }
  },

  Query: {
    connections: () => connections.all(),
    commands: () => commands.all(),
  },
}
