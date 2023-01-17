import { CommandType } from "../../types"

function path(...searchPath) {
  return obj => {
    let scaledObj = obj

    for (let i = 0; i < searchPath.length; i++) {
      scaledObj = scaledObj[searchPath[i]]

      if (typeof scaledObj === "undefined" || scaledObj === null) return null
    }

    return scaledObj
  }
}

const COMMON_MATCHING_PATHS = [
  path("type"),
  path("payload", "message"),
  path("payload", "preview"),
  path("payload", "name"),
  path("payload", "path"),
  path("payload", "triggerType"),
  path("payload", "description"),
  path("payload", "request", "url"),
]

export function filterSearch(commands: any[], search: string) {
  const trimmedSearch = (search || "").trim()

  if (trimmedSearch === "") return [...commands]

  const searchRegex = new RegExp(trimmedSearch.replace(/\s/, "."), "i")

  const matching = (value: string) => value && typeof value === "string" && searchRegex.test(value)

  return commands.filter(
    command =>
      COMMON_MATCHING_PATHS.filter(c => {
        if (matching(c(command))) return true
        if (
          command.type === CommandType.Log &&
          (matching("debug") || matching("warning") || matching("error"))
        )
          return true
        if (command.type === CommandType.ClientIntro && matching("connection")) return true
        return false
      }).length > 0
  )
}

export function filterHidden(commands: any[], hiddenCommands: CommandType[]) {
  if (hiddenCommands.length === 0) return commands

  return commands.filter(command => hiddenCommands.indexOf(command.type) === -1)
}

function filterCommands(commands: any[], search: string, hiddenCommands: CommandType[]) {
  const searchFilteredCommands = filterSearch(commands, search)
  return filterHidden(searchFilteredCommands, hiddenCommands)
}

export default filterCommands
