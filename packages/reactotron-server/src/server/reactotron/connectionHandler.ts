import { connections } from "../datastore"
import { messaging, MessageTypes } from "../messaging"

function onConnectionEstablished(connection) {
  const newConnection = { clientId: connection.clientId, platform: connection.platform }
  connections.addConnection(newConnection)
  messaging.publish(MessageTypes.CONNECTION_ESTABLISHED, { connectionsUpdated: connections.all() })
}

function onConnectionDisconnected(connection) {
    // TODO: Remove this junk
    connections.removeConnection(connection)
    messaging.publish(MessageTypes.CONNECTION_DISCONNECTED, { connectionsUpdated: connections.all() })
}

export function addEventHandlers(reactotronServer) {
  reactotronServer.on("connectionEstablished", onConnectionEstablished)
  reactotronServer.on("disconnect", onConnectionDisconnected)
}
