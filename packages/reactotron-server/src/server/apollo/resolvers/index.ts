import { ConnectionsResolver } from "./connections"
import { CommandsResolver } from "./commands"
import { ExecutedCommandsResolver } from "./executedCommands"

const resolvers = [ConnectionsResolver, CommandsResolver, ExecutedCommandsResolver]

export { resolvers }
