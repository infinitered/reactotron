import { ApiResponse } from "./ApiResponse"
import { SagaTaskComplete } from "./SagaTaskComplete"

// One day this could be figured out programatically!
const commandsMap = {
  "api.response": ApiResponse,
  "saga.task.complete": SagaTaskComplete, 
}

export function getCommand(type: string) {
  return commandsMap[type]
}
