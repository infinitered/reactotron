import { Connections } from "./connections"
import { Commands } from "./commands"
import { ExecutedCommands } from "./executedCommands"

const connectionsStore = new Connections()
const commandsStore = new Commands()
const executedCommandsStore = new ExecutedCommands()

export { connectionsStore, commandsStore, executedCommandsStore }
