import { Emulator } from "javascript-terminal"

export default class ReactotronEmulator extends Emulator {
  uiStore: any

  constructor(uiStore) {
    super()

    this.uiStore = uiStore
  }

  _updateStateByExecution(state, commandStrToExecute) {
    // TODO: Other things.

    if (commandStrToExecute === "exit") {
      this.uiStore.openTerminal(false)
    }

    this.uiStore.server.send("repl", commandStrToExecute)

    return state
  }
}
