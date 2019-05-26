import { Emulator } from "javascript-terminal"

export default class ReactotronEmulator extends Emulator {
  commandHandler: any

  constructor(commandHandler) {
    super()

    this.commandHandler = commandHandler
  }

  _updateStateByExecution(state, commandStrToExecute) {
    return this.commandHandler(state, commandStrToExecute)
  }
}
