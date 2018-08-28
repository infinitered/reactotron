import { Backups } from "./backups"
import { Commands } from "./commands"
import { Connections } from "./connections"
import { ExecutedCommands } from "./executedCommands"

const backupsStore = new Backups()
const commandsStore = new Commands()
const connectionsStore = new Connections()
const executedCommandsStore = new ExecutedCommands()

export { backupsStore, commandsStore, connectionsStore, executedCommandsStore }
