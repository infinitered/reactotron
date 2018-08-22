export interface Command {
  type: string
}

export class Commands {
  commands: Command[] = []

  addCommand(command: Command) {
    this.commands.push(command)
  }

  all() {
    return this.commands
  }
}
