import UiStore from './UiStore'
import { createServer } from 'reactotron-core-server'
import { action, observable, computed, reaction, observe } from 'mobx'
import {
  contains,
  last,
  isNil,
  reject,
  equals,
  reverse,
  pipe,
  propEq,
  map,
  fromPairs,
  test,
  any,
  path
} from 'ramda'
import { dotPath } from 'ramdasauce'
import shallowDiff from '../Lib/ShallowDiff'
import Commands from '../Lib/commands'

const isSubscription = propEq('type', 'state.values.change')
const isSubscriptionCommandWithEmptyChanges = command =>
  isSubscription(command) && dotPath('payload.changes.length', command) === 0

/**
 * Functions to check a command when searching.
 */
const COMMON_MATCHING_PATHS = [
  path(['type']),
  path(['payload', 'message']),
  path(['payload', 'preview']),
  path(['payload', 'name']),
  path(['payload', 'path']),
  path(['payload', 'triggerType']),
  path(['payload', 'description']),
  path(['payload', 'request', 'url']),
  path(['payload', 'request', 'url'])
]

class Session {
  // commands to exlude in the timeline
  @observable commandsHiddenInTimeline = JSON.parse(localStorage.getItem('commandsHiddenInTimeline')) || []
  // Connections
  @observable connections = []
  // Selected Connection
  @observable selectedConnection = null

  commandsManager = new Commands()

  // holds the last known state of the subscription values
  subscriptions = {}

  // checks if it was the exact same as last time
  isSubscriptionValuesSameAsLastTime (command) {
    if (!isSubscription(command)) return false
    const rawChanges = command.payload ? command.payload.changes : []
    const newSubscriptions = fromPairs(map(change => [change.path, change.value], rawChanges))
    const isNew = !equals(this.subscriptions, newSubscriptions)

    // 🚨🚨🚨 side effect alert 🚨🚨🚨
    if (isNew) {
      const diff = shallowDiff(this.subscriptions, newSubscriptions)
      command.payload.changed = map(v => v.rightValue, diff.difference || [])
      command.payload.added = diff.onlyOnRight || []
      command.payload.removed = diff.onlyOnLeft || []
      this.subscriptions = newSubscriptions
    }
    // 🚨🚨🚨 side effect alert 🚨🚨🚨

    return !isNew
  }

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
      value && typeof value === 'string' && test(this.ui.searchRegexp, value)

    // typical paths that might match
    if (any(x => matching(x(command)), COMMON_MATCHING_PATHS)) {
      return false
    }

    // A few commands have their UI represented differently than their data. This is probably
    // not the best place for this, however, it'll be fine for now.
    if (command.type === 'log' && (matching('debug') || matching('warning') || matching('error'))) {
      return false
    } else if (command.type === 'client.intro' && matching('connection')) {
      return false
    }

    // ignore everything else
    return true
  }

  rejectCommandsFromOtherConnections = command => {
    if (!this.selectedConnection) return false

    return this.selectedConnection.id !== command.connectionId
  }

  @computed
  get commands () {
    return pipe(
      dotPath('commandsManager.all'),
      reject(this.rejectCommandsFromOtherConnections),
      reject(isSubscriptionCommandWithEmptyChanges),
      reject(this.isSubscriptionValuesSameAsLastTime),
      reject(command => contains(command.type, this.commandsHiddenInTimeline)),
      reject(this.rejectCommandWhenSearching),
      reverse
    )(this)
  }

  @computed
  get watches () {
    const changeCommands = this.commandsManager['state.values.change']
    if (isNil(changeCommands)) return []
    if (changeCommands.length === 0) return []
    const recentCommand = last(changeCommands)
    return dotPath('payload.changes', recentCommand) || []
  }

  @computed
  get backups () {
    return this.commandsManager['state.backup.response']
  }

  // are commands of this type hidden?
  isCommandHidden (commandType) {
    return contains(commandType, this.commandsHiddenInTimeline)
  }

  // toggles whether a command type is to be ignored or not
  @action
  toggleCommandVisibility (commandType) {
    const hidden = this.isCommandHidden(commandType)
    if (hidden) {
      this.commandsHiddenInTimeline.remove(commandType)
    } else {
      this.commandsHiddenInTimeline.push(commandType)
    }
    localStorage.setItem('commandsHiddenInTimeline', JSON.stringify(this.commandsHiddenInTimeline))
    return !hidden
  }

  // Sets the selected connection
  @action
  setSelectedConnection (connection) {
    this.selectedConnection = connection
  }

  handleCommand = command => {
    if (command.type === 'clear') {
      const newCommands = pipe(
        dotPath('commandsManager.all'),
        reject(c => c.connectionId === command.connectionId),
      )(this)

      this.commandsManager.all.clear()
      this.commandsManager.all.push(...newCommands)
    } else {
      this.commandsManager.addCommand(command)
    }
  }

  handleConnectionsChange = () => {
    // TODO: See if we can be better at clearing instead of clearing everything then resetting every single time.
    this.connections.clear()
    this.connections.push(...this.server.connections)

    if (this.selectedConnection && !this.connections.find(c => c.id === this.selectedConnection.id)) {
      this.selectedConnection = null
    }
  }

  constructor (port = 9090) {
    this.server = createServer({ port })

    this.server.on('command', this.handleCommand)
    this.server.on('connectionEstablished', this.handleConnectionsChange)
    this.server.on('disconnect', this.handleConnectionsChange)

    this.server.start()
    this.isSubscriptionValuesSameAsLastTime = this.isSubscriptionValuesSameAsLastTime.bind(this)

    // create the ui store
    this.ui = new UiStore(this.server, this.commandsManager)

    // hide or show the watch panel depending if we have watches
    reaction(
      () => this.watches.length > 0,
      show => {
        this.ui.showWatchPanel = show
      }
    )

    // when a new backup arrives, open the editor to rename it
    observe(this.backups, change => {
      if (change.type === 'splice' && change.added.length === 1) {
        this.ui.openRenameStateDialog(change.added[0])
      }
    })
  }
}

export default Session
