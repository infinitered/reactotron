import { Resolver, Query, Subscription, Root, Args, Arg } from "type-graphql"

import { MessageTypes } from "../../messaging"
import { Command } from "../../schema"
import { commandsStore } from "../../datastore"
import { CommandAddedArgs } from "../../schema/command"

@Resolver()
export class CommandsResolver {
  @Query(() => [Command])
  commands(
    @Arg("clientId", { nullable: true }) clientId?: string,
    @Arg("filter", () => [String], { nullable: true }) filter?: [string],
  ) {
    return commandsStore.get(clientId, filter)
  }

  @Subscription(() => Command, {
    topics: [MessageTypes.COMMAND_ADDED],
    filter: ({ payload, args }) => commandsStore.filterItem(payload, args.clientId, args.filter),
  })
  commandAdded(@Root() command: Command, @Args() { clientId, filter }: CommandAddedArgs): Command {
    return command
  }
}
