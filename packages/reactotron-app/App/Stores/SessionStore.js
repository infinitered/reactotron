import UiStore from './UiStore'
import { createServer } from 'reactotron-core-server'
import { computed, reaction } from 'mobx'
import { last, isNil, reject, reverse, pipe, propEq } from 'ramda'
import { dotPath } from 'ramdasauce'

class Session {

  @computed get commands () {
    return pipe(
      dotPath('server.commands.all'),
      reject(propEq('type', 'state.values.change')),
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

  constructor (port = 9090) {
    this.server = createServer({ port })
    this.server.start()

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
