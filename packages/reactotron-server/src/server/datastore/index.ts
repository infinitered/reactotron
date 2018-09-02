import { Commands } from "./commands"
import { Connections } from "./connections"
import { ExecutedCommands } from "./executedCommands"

const commandsStore = new Commands()
const connectionsStore = new Connections()
const executedCommandsStore = new ExecutedCommands()

export { commandsStore, connectionsStore, executedCommandsStore }
