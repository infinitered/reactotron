import { ApiResponse } from "./ApiResponse"
import { SagaTaskComplete } from "./SagaTaskComplete"

// One day this could be figured out programatically!
const commandsMap = {
  "api.response": ApiResponse,
  "saga.task.complete": SagaTaskComplete,
}

export function getCommandRenderer(command: any) {
  const Renderer = commandsMap[command.type]

  if (!Renderer) return null

  return new Renderer(command)
}
