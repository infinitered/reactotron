import { action, observable } from "mobx"
import { pipe, reject } from "ramda"
import { dotPath } from "ramdasauce"

export const MAX_COMMANDS = 500

// how often to flush the buffer of commands into the main list
const FLUSH_TIME = 50

class Commands {
  /**
   * It's all the comands.  Like all of them.
   */
  all = observable.array([], { deep: false })

  // temporary holding are for inbound messages
  buffer = []

  /**
   * Constructor with an optional overrideable max list size.
   */
  constructor() {
    setTimeout(() => this.flush(), FLUSH_TIME)
  }

  /**
   * Flush the buffer of new commands into the main list.
   */
  @action
  flush() {
    if (this.buffer.length > 0) {
      const newList = [...this.buffer.reverse(), ...this.all.slice()]
      this.buffer = []
      this.all.replace(newList.slice(0, MAX_COMMANDS))
    }
    setTimeout(() => this.flush(), FLUSH_TIME)
  }

  /**
   * Receives a new message from the app.
   */
  addCommand(command) {
    this.buffer.push(command)
  }

  /**
   * Clear commands for a clientId
   */
  clearClientsCommands(clientId) {
    debugger
    const newCommands = pipe(
      dotPath("all"),
      reject(c => c.clientId === clientId)
    )(this)

    this.all.clear()
    this.all.push(...newCommands)
  }
}

export default Commands
