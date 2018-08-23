import { Resolver, Query, Subscription, Root, Mutation, Arg } from "type-graphql"
import * as GraphQLJSON from "graphql-type-json"

import { messaging, MessageTypes } from "../../messaging"
import { ExecutedCommand } from "../../schema"
import { executedCommands } from "../../datastore"
import { createReactotronServer } from "../../reactotron"

@Resolver()
export class ExecutedCommandsResolver {
  @Query(() => [ExecutedCommand])
  executedCommands() {
    return executedCommands.all()
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

    executedCommands.addCommand(newCommand)
    messaging.publish(MessageTypes.EXECUTED_COMMAND_ADDED, newCommand)

    // Welcome to the hack zone. Where everything is permitted as long as it works.
    // TODO: Better name? Put this into a singleton that we can import and use instead of this function? Better everything? something? ANYTHING?
    const reactotronServer = createReactotronServer()

    reactotronServer.send(type, payload)
    // Now leaving the hack zone.

    return true
  }

  @Subscription(() => ExecutedCommand, {
    topics: [MessageTypes.EXECUTED_COMMAND_ADDED],
  })
  commandExecuted(@Root() command: ExecutedCommand): ExecutedCommand {
    return command
  }
}
