import { ApiResponse } from "./ApiResponse"

// One day this could be figured out programatically!
const commandsMap = {
  "api.response": ApiResponse,
}

export function getCommand(type: string) {
  return commandsMap[type]
}
