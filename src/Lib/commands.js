import { action, observable, computed } from "mobx"
import { pipe, reject, contains, propEq } from "ramda"
import { dotPath } from "ramdasauce"
import config from "./config"

export const MAX_COMMANDS = config.get("commandHistory", 500)

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
  constructor(session) {
    setTimeout(() => this.flush(), FLUSH_TIME)
    this.session = session
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
    const newCommands = pipe(
      dotPath("all"),
      reject(c => c.clientId === clientId)
    )(this)

    this.all.clear()
    this.all.push(...newCommands)
  }

  @computed
  get commands() {
    const isSubscription = propEq("type", "state.values.change")
    const isSubscriptionCommandWithEmptyChanges = command => {
      return isSubscription(command) && dotPath("payload.changes.length", command) === 0
    }

    const result = pipe(
      () => this.all,
      reject(this.rejectCommandsFromOtherConnections),
      reject(isSubscriptionCommandWithEmptyChanges),
      reject(command => contains(command.type, this.session.commandsHiddenInTimeline)),
      reject(this.session.rejectCommandWhenSearching)
    )(this);
    return result;
  }

  rejectCommandsFromOtherConnections = command => {
    if (!this.session.selectedConnection) return false

    return this.session.selectedConnection.clientId !== command.clientId
  }
}

export default Commands
