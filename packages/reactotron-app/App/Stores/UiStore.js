import { observable, action } from 'mobx'
import Mousetrap from '../Lib/Mousetrap.min.js'
import { isNilOrEmpty } from 'ramdasauce'
import Keystroke from '../Lib/Keystroke'

/**
 * Handles UI state.
 */
class UI {
  /**
   * Which tab are we on?
   */
  @observable tab = 'timeline'

  /**
   * Targets state keys or values from the UI & commands.
   */
  @observable keysOrValues = 'keys'

  // whether or not to show the state find dialog
  @observable showStateFindDialog = false

  // whether or not to show the state dispatch dialog
  @observable showStateDispatchDialog = false

  // whether or not to show the help dialog
  @observable showHelpDialog = false

  // the watch dialog
  @observable showStateWatchDialog = false

  // the current watch to add
  @observable watchToAdd

  // the current action to dispatch
  @observable actionToDispatch

  // show the watch panel?
  @observable showWatchPanel = false

  constructor (server) {
    this.server = server

    Mousetrap.prototype.stopCallback = () => false

    Mousetrap.bind(`${Keystroke.mousetrap}+k`, this.reset)
    Mousetrap.bind(`${Keystroke.mousetrap}+f`, this.openStateFindDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+d`, this.openStateDispatchDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+s`, this.backupState)
    Mousetrap.bind(`tab`, this.toggleKeysValues)
    Mousetrap.bind(`escape`, this.popState)
    Mousetrap.bind(`enter`, this.submitCurrentForm)
    Mousetrap.bind(`${Keystroke.mousetrap}+enter`, this.submitCurrentFormDelicately)
    Mousetrap.bind(`${Keystroke.mousetrap}+n`, this.openStateWatchDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+1`, this.switchTab.bind(this, 'timeline'))
    Mousetrap.bind(`${Keystroke.mousetrap}+2`, this.switchTab.bind(this, 'subscriptions'))
    Mousetrap.bind(`${Keystroke.mousetrap}+3`, this.switchTab.bind(this, 'backups'))
    Mousetrap.bind(`${Keystroke.mousetrap}+/`, this.switchTab.bind(this, 'help'))
    Mousetrap.bind(`${Keystroke.mousetrap}+?`, this.switchTab.bind(this, 'help'))
  }

  @action switchTab = (newTab) => {
    this.tab = newTab
  }

  @action popState = () => {
    if (this.showStateFindDialog) {
      this.closeStateFindDialog()
    }
    if (this.showHelpDialog) {
      this.closeHelpDialog()
    }
  }

  @action submitCurrentForm = () => {
    if (this.showStateWatchDialog) {
      this.submitStateWatch()
    }
  }

  @action submitCurrentFormDelicately = () => {
    if (this.showStateDispatchDialog) {
      this.submitStateDispatch()
    }
  }

  @action submitStateWatch = () => {
    this.server.stateValuesSubscribe(this.watchToAdd)
    this.showStateWatchDialog = false
    this.watchToAdd = null
  }

  @action removeStateWatch = (path) => {
    this.server.stateValuesUnsubscribe(path)
  }

  @action clearStateWatches = () => {
    this.server.stateValuesClearSubscriptions()
  }

  @action setActionToDispatch (action) {
    this.actionToDispatch = action
    this.showStateDispatchDialog = true
  }

  @action submitStateDispatch = () => {
    // try not to blow up the frame
    let action = null
    try {
      // brackets are need on chromium side, huh.
      action = eval('(' + this.actionToDispatch + ')') // eslint-disable-line
    } catch (e) {
    }
    // jet if not valid
    if (isNilOrEmpty(action)) return

    // let's attempt to dispatch
    this.dispatchAction(action)
    // close the form
    this.showStateDispatchDialog = false
  }

  @action openStateFindDialog = () => {
    this.showStateFindDialog = true
  }

  @action closeStateFindDialog = () => {
    this.showStateFindDialog = false
  }

  @action openStateWatchDialog = () => {
    this.showStateWatchDialog = true
  }

  @action closeStateWatchDialog = () => {
    this.showStateWatchDialog = false
  }

  @action openStateDispatchDialog = () => {
    this.showStateDispatchDialog = true
  }

  @action toggleHelpDialog = () => {
    this.showHelpDialog = !this.showHelpDialog
  }

  @action openHelpDialog = () => {
    this.showHelpDialog = true
  }

  @action closeStateDispatchDialog = () => {
    this.showStateDispatchDialog = false
  }

  @action closeHelpDialog = () => {
    this.showHelpDialog = false
  }

  @action reset = () => {
    this.server.commands.all.clear()
  }

  @action getStateKeysOrValues = (path) => {
    if (this.keysOrValues === 'keys') {
      this.getStateKeys(path)
    } else {
      this.getStateValues(path)
    }
  }

  @action getStateValues = (path) => {
    this.server.stateValuesRequest(path)
  }

  @action getStateKeys = (path) => {
    this.server.stateKeysRequest(path)
  }

  @action dispatchAction = action => {
    this.server.stateActionDispatch(action)
  }

  @action toggleKeysValues = () => {
    if (this.keysOrValues === 'keys') {
      this.keysOrValues = 'values'
    } else {
      this.keysOrValues = 'keys'
    }
  }

  @action toggleWatchPanel = () => {
    this.showWatchPanel = !this.showWatchPanel
  }

  // grab a copy of the state for backup purposes
  @action backupState = () => this.server.stateBackupRequest()

  // change the state on the app to this
  @action restoreState = state => this.server.stateRestoreRequest(state)

  // removes an existing state object
  @action deleteState = state => {
    this.server.commands['state.backup.response'].remove(state)
  }

}

export default UI
