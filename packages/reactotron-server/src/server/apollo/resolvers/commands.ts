import { Resolver, Query, Subscription, Root } from "type-graphql"

import { MessageTypes } from "../../messaging"
import { Command } from "../../schema"
import { commands } from "../../datastore"

@Resolver()
export class CommandsResolver {
  @Query(() => [Command])
  commands() {
    return commands.all()
  }

  @Subscription(() => Command, {
    topics: [MessageTypes.COMMAND_ADDED],
  })
  commandAdded(@Root() command: Command): Command {
    return command
  }
}
