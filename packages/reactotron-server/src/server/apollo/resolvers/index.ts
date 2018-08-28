import { BackupsResolver } from "./backups"
import { CommandsResolver } from "./commands"
import { ConnectionsResolver } from "./connections"
import { ExecutedCommandsResolver } from "./executedCommands"

const resolvers = [BackupsResolver, CommandsResolver, ConnectionsResolver, ExecutedCommandsResolver]

export { resolvers }
