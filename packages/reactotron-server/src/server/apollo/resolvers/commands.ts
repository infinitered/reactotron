import { Resolver, Query, Subscription, Root, Args, Arg } from "type-graphql"

import { MessageTypes } from "../../messaging"
import { Command } from "../../schema"
import { commands } from "../../datastore"
import { CommandAddedArgs } from "../../schema/command"

@Resolver()
export class CommandsResolver {
  @Query(() => [Command])
  commands(@Arg("clientId", { nullable: true }) clientId?: string) {
    if (clientId) {
      return commands.byClientId(clientId)
    }

    return commands.all()
  }

  @Subscription(() => Command, {
    topics: [MessageTypes.COMMAND_ADDED],
    filter: ({ payload, args }) => !args.clientId || args.clientId === payload.clientId,
  })
  commandAdded(@Root() command: Command, @Args() { clientId }: CommandAddedArgs): Command {
    return command
  }
}
