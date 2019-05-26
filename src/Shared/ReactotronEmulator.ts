import { Emulator, OutputFactory } from "javascript-terminal"

interface Props {
  currentPrompt: string
}

export default class ReactotronEmulator extends Emulator {
  commandHandler: any
  currentPrompt: string

  constructor(commandHandler) {
    super()

    this.commandHandler = commandHandler
  }

  setCurrentPrompt = prompt => {
    this.currentPrompt = prompt
  }

  getCurrentPrompt = () => {
    return this.currentPrompt
  }

  _updateStateByExecution(state, commandStrToExecute) {
    return this.commandHandler(state, commandStrToExecute)
  }

  _addHeaderOutput(state, commandStr) {
    return (this as any)._addCommandOutputs(state, [
      new OutputFactory.OutputRecord({
        type: "HEADER_OUTPUT_TYPE",
        content: { cwd: null, command: commandStr, prompt: this.getCurrentPrompt() },
      }),
    ])
  }
}
