import UiStore from './UiStore'
import { createServer } from 'reactotron-core-server'
import { action, observable, computed, reaction, observe } from 'mobx'
import { contains, last, isNil, reject, equals, reverse, pipe, propEq, map, fromPairs } from 'ramda'
import { dotPath } from 'ramdasauce'
import shallowDiff from '../Lib/ShallowDiff'
import Commands from '../Lib/commands';

const isSubscription = propEq('type', 'state.values.change')
const isSubscriptionCommandWithEmptyChanges = command =>
  isSubscription(command) && dotPath('payload.changes.length', command) === 0

class Session {
  // commands to exlude in the timeline
  @observable commandsHiddenInTimeline = []

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

  @computed
  get commands () {
    return pipe(
      dotPath('commandsManager.all'),
      reject(isSubscriptionCommandWithEmptyChanges),
      reject(this.isSubscriptionValuesSameAsLastTime),
      reject(command => contains(command.type, this.commandsHiddenInTimeline)),
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
    return !hidden
  }

  handleCommand = command => {
    if (command.type === '') {
      this.commandsManager.all.clear()
    } else {
      this.commandsManager.addCommand(command)
    }
  }

  constructor (port = 9090) {
    this.server = createServer({ port, onCommand: this.handleCommand })
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
