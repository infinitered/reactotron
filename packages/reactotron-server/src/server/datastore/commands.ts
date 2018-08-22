export type Command = {}

export class Commands {
  commands: Command[] = []

  addCommand(command: Command) {
    this.commands.push(command)
  }

  all() {
      return this.commands
  }
}
