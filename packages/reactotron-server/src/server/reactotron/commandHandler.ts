import { commands } from "../datastore"
import { messaging, MessageTypes } from "../messaging"

function onCommand(command) {
    commands.addCommand(command)
    messaging.publish(MessageTypes.COMMAND_ADDED, { commandAdded: command })
}

export function addEventHandlers(reactotronServer) {
  reactotronServer.on("command", onCommand)
}
