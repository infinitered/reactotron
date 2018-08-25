import { Command } from "../schema"

export class Commands {
  commands: Command[] = []

  addCommand(command: Command) {
    this.commands.push(command)
  }

  filterItem(item: Command, clientId?: string, filter?: [string]) {
    return (
      (!clientId || item.clientId === clientId) &&
      (!filter || filter.some(fil => fil === item.type))
    )
  }

  // Ideally this would be something we could figure out above but I couldn't get a boolean | Function return type to play well with the filter line below
  filterItemComposable(clientId?: string, filter?: [string]) {
    return function(item: Command) {
      return this.filterItem(item, clientId, filter)
    }
  }

  get(clientId?: string, filter?: [string]) {
    return this.commands.filter(this.filterItemComposable(clientId, filter))
  }

  all() {
    return this.commands
  }
}
