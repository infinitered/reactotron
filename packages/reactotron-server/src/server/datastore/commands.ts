import { Command } from "../schema"

export class Commands {
  commands: Command[] = []

  addCommand(command: Command) {
    this.commands.push(command)
  }

  byClientId(clientId) {
    return this.commands.filter(cmd => cmd.clientId === clientId)
  }

  all() {
    return this.commands
  }
}
