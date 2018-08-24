import { ExecutedCommand } from "../schema"

export class ExecutedCommands {
  commands: ExecutedCommand[] = []

  addCommand(command: ExecutedCommand) {
    this.commands.push(command)
  }

  all() {
    return this.commands
  }
}
