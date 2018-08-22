import { connections } from "../datastore"
import { messaging, MessageTypes } from "../messaging"
import { Connection } from "../datastore/connections"

function onConnectionEstablished(connection: any) {
  const newConnection: Connection = {
    clientId: connection.clientId,
    platform: connection.platform,
    name: connection.name,
    environment: connection.environment,
    reactotronLibraryName: connection.reactotronLibraryName,
    reactotronLibraryVersion: connection.reactotronLibraryVersion,
    platformVersion: connection.platformVersion,
    osRelease: connection.osRelease,
    model: connection.model,
    serverHost: connection.serverHost,
    forceTouch: connection.forceTouch,
    interfaceIdiom: connection.interfaceIdiom,
    systemName: connection.systemName,
    uiMode: connection.uiMode,
    serial: connection.serial,
    androidId: connection.androidId,
    reactNativeVersion: connection.reactNativeVersion,
    screenWidth: connection.screenWidth,
    screenHeight: connection.screenHeight,
    screenScale: connection.screenScale,
    screenFontScale: connection.screenFontScale,
    windowWidth: connection.windowWidth,
    windowHeight: connection.windowHeight,
    windowScale: connection.windowScale,
    windowFontScale: connection.windowFontScale,
    reactotronCoreClientVersion: connection.reactotronCoreClientVersion,
    address: connection.address,
    // id: connection.id,

  }
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
