import { Resolver, Query, Subscription, Root, Mutation, Arg } from "type-graphql"
import * as GraphQLJSON from "graphql-type-json"

import { messaging, MessageTypes } from "../../messaging"
import { ExecutedCommand } from "../../schema"
import { executedCommandsStore } from "../../datastore"
import { reactotron } from "../../reactotron"

@Resolver()
export class ExecutedCommandsResolver {
  @Query(() => [ExecutedCommand])
  executedCommands() {
    return executedCommandsStore.all()
  }

  @Mutation()
  executeCommand(
    @Arg("type") type: string,
    @Arg("payload", () => GraphQLJSON) payload: object,
  ): boolean {
    const newCommand = {
      type,
      date: new Date(),
      payload,
    }

    executedCommandsStore.addCommand(newCommand)
    messaging.publish(MessageTypes.EXECUTED_COMMAND_ADDED, newCommand)

    reactotron.send(type, payload)

    return true
  }

  @Subscription(() => ExecutedCommand, {
    topics: [MessageTypes.EXECUTED_COMMAND_ADDED],
  })
  commandExecuted(@Root() command: ExecutedCommand): ExecutedCommand {
    return command
  }
}
