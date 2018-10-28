import { Resolver, Query, Subscription, Mutation, Root, Args, Arg } from "type-graphql"

import { messaging, MessageTypes } from "../../messaging"
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

  @Mutation()
  clearCommands(@Arg("clientId", { nullable: true }) clientId?: string): boolean {
    commandsStore.removeConnectionCommands(clientId)

    messaging.publish(MessageTypes.COMMANDS_CLEARED, clientId)

    return true
  }

  @Subscription(() => Command, {
    topics: [MessageTypes.COMMAND_ADDED],
    filter: ({ payload, args }) => createCommandMatcher(args.clientId, args.filter)(payload),
  })
  commandAdded(@Root() command: Command, @Args() { clientId, filter }: CommandAddedArgs): Command {
    return command
  }

  @Subscription(() => Command, {
    topics: [MessageTypes.COMMANDS_CLEARED],
  })
  commandsCleared(@Root() clientId: string): { clientId: string } {
    return { clientId }
  }
}
