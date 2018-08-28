import { commandsStore, backupsStore } from "../datastore"
import { messaging, MessageTypes } from "../messaging"
import { Command } from "../schema"
import { pluginManager } from "../pluginManager"

/**
 * Fires when an event arrives from a reactotron client.
 *
 * This is responsible for handing the command off to the datastore and
 * signaling the GraphQL subscription service that it happened.
 *
 * @param command A command sent from the client.
 */
export function onCommand(command: Command) {
  commandsStore.addCommand(command)
  messaging.publish(MessageTypes.COMMAND_ADDED, command)
  pluginManager.onCommand(command)

  // TODO: Burn this to the ground once we pull it out to a plugin yo.
  if (command.type === "state.backup.response") {
    backupsStore.addBackup(command)
    messaging.publish(MessageTypes.BACKUP_ADDED, command)
  }
}

/**
 * Registers handlers for the events that reactotron fires.
 *
 * @param reactotronServer The reactotron-core-server instance
 */
export function addEventHandlers(reactotronServer) {
  reactotronServer.on("command", onCommand)
}
