import { action, computed, observable, reaction, toJS } from "mobx"
import {
  any,
  contains,
  equals,
  fromPairs,
  last,
  head,
  map,
  path,
  pipe,
  propEq,
  reject,
  test,
} from "ramda"
import { dotPath, isNilOrEmpty } from "ramdasauce"
import { createServer } from "reactotron-core-server"
import shallowDiff from "../Lib/ShallowDiff"
import Commands from "../Lib/commands"
import { StateBackupStore } from "./StateBackupStore"
import UiStore from "./UiStore"

const isSubscription = propEq("type", "state.values.change")
const isSubscriptionCommandWithEmptyChanges = command =>
  isSubscription(command) && dotPath("payload.changes.length", command) === 0

/**
 * Functions to check a command when searching.
 */
const COMMON_MATCHING_PATHS = [
  path(["type"]),
  path(["payload", "message"]),
  path(["payload", "preview"]),
  path(["payload", "name"]),
  path(["payload", "path"]),
  path(["payload", "triggerType"]),
  path(["payload", "description"]),
  path(["payload", "request", "url"]),
]

class Session {
  // commands to exlude in the timeline
  @observable
  commandsHiddenInTimeline = JSON.parse(localStorage.getItem("commandsHiddenInTimeline")) || []
  // Connections
  @observable connections = []
  // Selected Connection
  @observable selectedConnection = null
  @observable customCommands = []

  port = 9090

  commandsManager = new Commands()

  /**
   * Manages state backup persistence.
   */
  stateBackupStore

  /**
   * Should we reject this command when we are searching?
   *
   * This will be based on the search term that user has typed in.
   */
  rejectCommandWhenSearching = command => {
    // only reject when we're searching
    if (!this.ui.isTimelineSearchVisible || !this.ui.isValidSearchPhrase) {
      return false
    }

    // safely matching the search term regexp against something passed in
    const matching = value =>
      value && typeof value === "string" && test(this.ui.searchRegexp, value)

    // typical paths that might match
    if (any(x => matching(x(command)), COMMON_MATCHING_PATHS)) {
      return false
    }

    // A few commands have their UI represented differently than their data. This is probably
    // not the best place for this, however, it'll be fine for now.
    if (command.type === "log" && (matching("debug") || matching("warning") || matching("error"))) {
      return false
    } else if (command.type === "client.intro" && matching("connection")) {
      return false
    }

    // ignore everything else
    return true
  }

  rejectCommandsFromOtherConnections = command => {
    if (!this.selectedConnection) return false

    return this.selectedConnection.clientId !== command.clientId
  }

  @computed
  get commands() {
    return pipe(
      dotPath("commandsManager.all"),
      reject(this.rejectCommandsFromOtherConnections),
      reject(isSubscriptionCommandWithEmptyChanges),
      reject(command => contains(command.type, this.commandsHiddenInTimeline)),
      reject(this.rejectCommandWhenSearching)
    )(this)
  }

  @computed
  get watches() {
    const changeCommands = this.commandsManager.all.filter(c => c.type === "state.values.change")

    let connectionsChangeCommands = null
    if (this.connections.length < 2) {
      connectionsChangeCommands = changeCommands
    } else {
      if (!this.selectedConnection) return [] // If we have > 1 connection and "All" is selected jet since what we will show won't be "all"
      connectionsChangeCommands = reject(
        c => c.connectionId === this.selectedConnection.id,
        changeCommands
      )
    }

    const recentCommand = head(connectionsChangeCommands)
    const latest = dotPath("payload.changes", recentCommand) || []
    return latest
  }

  // are commands of this type hidden?
  isCommandHidden(commandType) {
    return contains(commandType, this.commandsHiddenInTimeline)
  }

  // set whether a command type is to be ignored or not
  @action
  setCommandVisibility(commandType, visibility) {
    const hidden = this.isCommandHidden(commandType)
    if (hidden && visibility) {
      this.commandsHiddenInTimeline.remove(commandType)
    } else if (!hidden && !visibility) {
      this.commandsHiddenInTimeline.push(commandType)
    }
    localStorage.setItem("commandsHiddenInTimeline", JSON.stringify(this.commandsHiddenInTimeline))
    return !hidden
  }

  // toggles whether a command type is to be ignored or not
  @action
  toggleCommandVisibility(commandType) {
    const hidden = this.isCommandHidden(commandType)
    if (hidden) {
      this.commandsHiddenInTimeline.remove(commandType)
    } else {
      this.commandsHiddenInTimeline.push(commandType)
    }
    localStorage.setItem("commandsHiddenInTimeline", JSON.stringify(this.commandsHiddenInTimeline))
    return !hidden
  }

  // Sets the selected connection
  @action
  setSelectedConnection(connection) {
    this.selectedConnection = connection
  }

  getSelectedConnection = () => {
    return this.selectedConnection
  }

  rewriteChangesSinceLastStateSubscription = command => {
    // get the list of changes
    const rawChanges = command.payload ? command.payload.changes : []

    // turn the new subscription values into an object
    const newSubs = fromPairs(map(change => [change.path, change.value], rawChanges))

    // turn the old subscription values into an object
    const oldSubs = fromPairs(map(change => [change.path, change.value], this.watches))

    // has the subscription data changed at all?
    if (!equals(oldSubs, newSubs)) {
      // calculate the difference between the two
      const diff = shallowDiff(oldSubs, newSubs)

      // put these back on the payload of that message
      command.payload.changed = map(v => v.rightValue, diff.difference || [])
      command.payload.added = diff.onlyOnRight || []
      command.payload.removed = diff.onlyOnLeft || []
      return true
    } else {
      return false
    }
  }

  @action
  handleCommand = command => {
    if (command.type === "clear") {
      this.commandsManager.clearClientsCommands(command.clientId)

      return
    } else if (command.type === "customCommand.register") {
      this.customCommands.push({
        clientId: command.clientId,
        ...command.payload,
      })

      return
    } else if (command.type === "customCommand.unregister") {
      const newCustomCommands = pipe(
        dotPath("customCommands"),
        reject(c => c.clientId === command.clientId && c.id === command.payload.id)
      )(this)
      this.customCommands.clear()
      this.customCommands.push(...newCustomCommands)

      return
    } else if (command.type === "state.values.change") {
      const isNew = this.rewriteChangesSinceLastStateSubscription(command)
      if (!isNew) {
        return
      }
    } else if (command.type.substr(0, 5) === "repl.") {
      this.ui.replResponse(command)
      return
    }

    this.commandsManager.addCommand(command)
  }

  handleConnectionEstablished = () => {
    this.customCommands.clear()
    this.customCommands.push(...this.customCommands.filter(c => c.clientId !== connection.clientId))

    this.handleConnectionsChange()
  }

  handleConnectionDisconnected = connection => {
    this.handleConnectionsChange()
  }

  handleConnectionsChange = () => {
    this.connections.clear()
    this.connections.push(...this.server.connections)

    if (this.connections.length === 0) {
      this.selectedConnection = null
    } else if (
      !this.selectedConnection ||
      (this.selectedConnection &&
        !this.connections.find(c => c.clientId === this.selectedConnection.clientId))
    ) {
      // If we don't have a connection OR if we do but its not in the list anymore select the first available one.
      this.selectedConnection = this.connections[0]
    }
  }

  addSubscription = path => {
    this.server.stateValuesSubscribe(path)
    localStorage.setItem("storedSubscriptions", JSON.stringify(this.server.subscriptions))
  }

  removeSubscription = path => {
    this.server.stateValuesUnsubscribe(path)
    localStorage.setItem("storedSubscriptions", JSON.stringify(this.server.subscriptions))
  }

  clearSubscriptions = () => {
    this.server.stateValuesClearSubscriptions()
    localStorage.setItem("storedSubscriptions", JSON.stringify(this.server.subscriptions))
  }

  sendInitialSubscriptions() {
    const storedSubscriptions = JSON.parse(localStorage.getItem("storedSubscriptions")) || []
    if (storedSubscriptions.length > 0) {
      storedSubscriptions.forEach(path => this.server.stateValuesSubscribe(path))
    }
  }

  constructor(port = 9090) {
    this.server = createServer({ port })
    this.port = port

    this.server.on("command", this.handleCommand)
    this.server.on("connectionEstablished", this.handleConnectionEstablished)

    // resend the storybook state to newly arriving connections
    this.server.on("connectionEstablished", connection =>
      this.ui.sendStorybookState(connection.clientId)
    )

    this.server.on("disconnect", this.handleConnectionDisconnected)

    this.stateBackupStore = new StateBackupStore(this.server)
    this.ui = new UiStore(
      this,
      this.server,
      this.commandsManager,
      this.stateBackupStore,
      this.getSelectedConnection,
      this.addSubscription,
      this.removeSubscription,
      this.clearSubscriptions
    )

    // hide or show the watch panel depending if we have watches
    reaction(
      () => {
        this.watches.length > 0
      },
      show => {
        this.ui.showWatchPanel = show
      }
    )

    this.server.start()

    this.sendInitialSubscriptions()
  }
}

export default Session
