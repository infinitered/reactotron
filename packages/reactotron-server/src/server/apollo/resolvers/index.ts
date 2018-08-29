import { CommandsResolver } from "./commands"
import { ConnectionsResolver } from "./connections"
import { ExecutedCommandsResolver } from "./executedCommands"

const resolvers = [CommandsResolver, ConnectionsResolver, ExecutedCommandsResolver]

export { resolvers }
