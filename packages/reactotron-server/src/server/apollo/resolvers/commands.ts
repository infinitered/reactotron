import { Resolver, Query, Subscription, Root, Args, Arg } from "type-graphql"

import { MessageTypes } from "../../messaging"
import { Command } from "../../schema"
import { commandsStore } from "../../datastore"
import { CommandAddedArgs } from "../../schema/command"
import { createCommandMatcher } from "../../datastore/commands"

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
    filter: ({ payload, args }) => createCommandMatcher(args.clientId, args.filter)(payload),
  })
  commandAdded(@Root() command: Command, @Args() { clientId, filter }: CommandAddedArgs): Command {
    return command
  }
}
