import { action, computed, observable, reaction } from "mobx"
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
  path(["payload", "request", "url"]),
]

class Session {
  // commands to exlude in the timeline
  @observable
  commandsHiddenInTimeline = JSON.parse(localStorage.getItem("commandsHiddenInTimeline")) || []

  commandsManager = new Commands()

  // holds the last known state of the subscription values
  subscriptions

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

  @computed
  get commands() {
    return pipe(
      dotPath("commandsManager.all"),
      reject(isSubscriptionCommandWithEmptyChanges),
      reject(command => contains(command.type, this.commandsHiddenInTimeline)),
      reject(this.rejectCommandWhenSearching)
    )(this)
  }

  @computed
  get watches() {
    const changeCommands = this.commandsManager.all.filter(c => c.type === "state.values.change")
    const recentCommand = head(changeCommands)
    const latest = dotPath("payload.changes", recentCommand) || []
    return latest
  }

  // are commands of this type hidden?
  isCommandHidden(commandType) {
    return contains(commandType, this.commandsHiddenInTimeline)
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

  rewriteChangesSinceLastStateSubscription = command => {
    // get the list of changes
    const rawChanges = command.payload ? command.payload.changes : []

    // convert it to a map
    const newSubscriptions = fromPairs(map(change => [change.path, change.value], rawChanges))

    // if they're not identical
    const isNew = this.subscriptions && !equals(this.subscriptions, newSubscriptions)

    if (isNew) {
      // calculate the difference between the two
      const diff = shallowDiff(this.subscriptions, newSubscriptions)

      // put these back on the payload of that message
      command.payload.changed = map(v => v.rightValue, diff.difference || [])
      command.payload.added = diff.onlyOnRight || []
      command.payload.removed = diff.onlyOnLeft || []

      // remember the most recent
    }
    this.subscriptions = newSubscriptions

    return isNew
  }

  @action
  handleCommand = command => {
    if (command.type === "clear") {
      this.commandsManager.all.clear()
      return
    } else if (command.type === "state.values.change") {
      const isNew = this.rewriteChangesSinceLastStateSubscription(command)
      if (!isNew) {
        return
      }
    }

    this.commandsManager.addCommand(command)
  }

  constructor(port = 9090) {
    this.server = createServer({ port })
    this.server.on("command", this.handleCommand)

    this.stateBackupStore = new StateBackupStore(this.server)
    this.ui = new UiStore(this.server, this.commandsManager, this.stateBackupStore)

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
  }
}

export default Session
