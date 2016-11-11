import UiStore from './UiStore'
import { createServer } from 'reactotron-core-server'
import { observable, computed, reaction } from 'mobx'
import { last, isNil, reject, equals, reverse, pipe, propEq, map, fromPairs } from 'ramda'
import { dotPath } from 'ramdasauce'
import shallowDiff from '../Lib/ShallowDiff'

const isSubscription = propEq('type', 'state.values.change')
const isSubscriptionCommandWithEmptyChanges = command => isSubscription(command) && dotPath('payload.changes.length', command) === 0

class Session {

  // holds the list of commands to include in the list
  @observable timelineCommandFilters = []

  // checks if a command is on the filter list
  isCommandFilteredOut = (command) => {
    return this.timelineCommandFilters.filter(cmd => cmd === command.type).length === 0
  }

  // holds the last known state of the subscription values
  subscriptions = {}

  // checks if it was the exact same as last time
  isSubscriptionValuesSameAsLastTime (command) {
    if (!isSubscription(command)) return false
    const rawChanges = command.payload && command.payload.changes || []
    const newSubscriptions = fromPairs(map(change => ([change.path, change.value]), rawChanges))
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

  @computed get commands () {
    return pipe(
      dotPath('server.commands.all'),
      reject(isSubscriptionCommandWithEmptyChanges),
      reject(this.isSubscriptionValuesSameAsLastTime),
      reject(this.isCommandFilteredOut),
      reverse
    )(this)
  }

  @computed get watches () {
    const changeCommands = this.server.commands['state.values.change']
    if (isNil(changeCommands)) return []
    if (changeCommands.length === 0) return []
    const recentCommand = last(changeCommands)
    return dotPath('payload.changes', recentCommand) || []
  }

  @computed get backups () {
    return this.server.commands['state.backup.response'].toJS().reverse()
  }

  constructor (port = 9090) {
    this.server = createServer({ port })
    this.server.start()
    this.isSubscriptionValuesSameAsLastTime = this.isSubscriptionValuesSameAsLastTime.bind(this)

    // create the ui store
    this.ui = new UiStore(this.server)

    // hide or show the watch panel depending if we have watches
    reaction(
      () => this.watches.length > 0,
      show => { this.ui.showWatchPanel = show }
    )
  }

}

export default Session
