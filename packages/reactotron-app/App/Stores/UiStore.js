import { computed, observable, action, asMap } from 'mobx'
import Mousetrap from '../Lib/Mousetrap.min.js'
import { isNilOrEmpty } from 'ramdasauce'
import Keystroke from '../Lib/Keystroke'
import { trim } from 'ramda'

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

  // the rename dialog
  @observable showRenameStateDialog = false

  // wheter or not to show the timeline filter dialog
  @observable showFilterTimelineDialog = false

  // the current watch to add
  @observable watchToAdd

  // the current name of a backup
  @observable backupStateName

  // the current action to dispatch
  @observable actionToDispatch

  // show the watch panel?
  @observable showWatchPanel = false

  /** The message we are currently composing to send to the client. */
  @observable customMessage = ''

  // show the send custom message dialog
  @observable showSendCustomDialog = false

  // show the timeline search
  @observable isTimelineSearchVisible = false

  /**
   * The current search phrase used to narrow down visible commands.
   */
  @observable searchPhrase = ''

  // additional properties that some commands may want... a way to communicate
  // from the command toolbar to the command
  commandProperties = {}

  constructor (server) {
    this.server = server

    Mousetrap.prototype.stopCallback = () => false

    Mousetrap.bind(`${Keystroke.mousetrap}+backspace`, this.reset)
    Mousetrap.bind(`${Keystroke.mousetrap}+k`, this.openStateFindDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+shift+f`, this.openFilterTimelineDialog)
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
    Mousetrap.bind(`${Keystroke.mousetrap}+4`, this.switchTab.bind(this, 'native'))
    Mousetrap.bind(`${Keystroke.mousetrap}+?`, this.switchTab.bind(this, 'help'))
    Mousetrap.bind(`${Keystroke.mousetrap}+f`, this.showTimelineSearch)
    Mousetrap.bind(`${Keystroke.mousetrap}+.`, this.openSendCustomDialog)
  }

  @action
  setSearchPhrase = value => {
    this.searchPhrase = value
  }

  /**
   * Get the scrubbed search phrase.
   */
  @computed
  get cleanedSearchPhrase () {
    return trim(this.searchPhrase || '')
  }

  /**
   * The regular expression we will be using to search commands.
   */
  @computed
  get searchRegexp () {
    try {
      return new RegExp(this.cleanedSearchPhrase.replace(/\s/, '.'), 'i')
    } catch (e) {
      return null
    }
  }

  /**
   * Is this search phrase useable?
   */
  @computed
  get isValidSearchPhrase () {
    return Boolean(this.searchRegexp)
  }

  @action
  hideTimelineSearch = () => {
    this.isTimelineSearchVisible = false
  }

  @action
  showTimelineSearch = () => {
    this.isTimelineSearchVisible = false // hack to ensure the reaction on the timeline header works (sheesh.)
    this.isTimelineSearchVisible = true
    this.switchTab('timeline')
  }

  @action
  toggleTimelineSearch = () => {
    if (this.isTimelineSearchVisible) {
      this.hideTimelineSearch()
    } else {
      this.showTimelineSearch()
    }
  }

  @action
  switchTab = newTab => {
    this.tab = newTab
  }

  @computed
  get isModalShowing () {
    return (
      this.showStateWatchDialog ||
      this.showStateFindDialog ||
      this.showStateDispatchDialog ||
      this.showFilterTimelineDialog ||
      this.showRenameStateDialog ||
      this.showSendCustomDialog
    )
  }

  @action
  popState = e => {
    if (this.showStateFindDialog) {
      this.closeStateFindDialog()
    } else if (this.showHelpDialog) {
      this.closeHelpDialog()
    }
    return false
  }

  @action
  submitCurrentForm = () => {
    if (this.showStateWatchDialog) {
      this.submitStateWatch()
    } else if (this.showRenameStateDialog) {
      this.submitRenameState()
    } else if (this.showSendCustomDialog) {
      this.submitCurrentMessage()
    }
  }

  @action
  submitCurrentFormDelicately = () => {
    if (this.showStateDispatchDialog) {
      this.submitStateDispatch()
    }
  }

  @action
  submitStateWatch = () => {
    this.server.stateValuesSubscribe(this.watchToAdd)
    this.showStateWatchDialog = false
    this.watchToAdd = null
  }

  @action
  submitRenameState = () => {
    this.currentBackupState.payload.name = this.backupStateName
    this.showRenameStateDialog = false
    this.backupStateName = null
  }

  @action
  submitCurrentMessage = () => {
    this.sendCustomMessage(this.customMessage)
    this.customMessage = ''
    this.showSendCustomDialog = false
  }

  @action
  removeStateWatch = path => {
    this.server.stateValuesUnsubscribe(path)
  }

  @action
  clearStateWatches = () => {
    this.server.stateValuesClearSubscriptions()
  }

  @action
  setActionToDispatch (action) {
    this.actionToDispatch = action
    this.showStateDispatchDialog = true
  }

  @action
  submitStateDispatch = () => {
    // try not to blow up the frame
    let action = null
    try {
      // brackets are need on chromium side, huh.
      action = eval('(' + this.actionToDispatch + ')') // eslint-disable-line
    } catch (e) {}
    // jet if not valid
    if (isNilOrEmpty(action)) return

    // let's attempt to dispatch
    this.dispatchAction(action)
    // close the form
    this.showStateDispatchDialog = false
  }

  @action
  openStateFindDialog = () => {
    this.showStateFindDialog = true
  }

  @action
  closeStateFindDialog = () => {
    this.showStateFindDialog = false
  }

  @action
  openStateWatchDialog = () => {
    this.showStateWatchDialog = true
  }

  @action
  closeStateWatchDialog = () => {
    this.showStateWatchDialog = false
  }

  @action
  openRenameStateDialog = backup => {
    this.showRenameStateDialog = true
    this.backupStateName = backup.payload.name
    this.currentBackupState = backup
  }

  @action
  closeRenameStateDialog = () => {
    this.showRenameStateDialog = false
  }

  @action
  openStateDispatchDialog = () => {
    this.showStateDispatchDialog = true
  }

  @action
  toggleHelpDialog = () => {
    this.showHelpDialog = !this.showHelpDialog
  }

  @action
  openHelpDialog = () => {
    this.showHelpDialog = true
  }

  @action
  closeStateDispatchDialog = () => {
    this.showStateDispatchDialog = false
  }

  @action
  closeHelpDialog = () => {
    this.showHelpDialog = false
  }

  @action
  openFilterTimelineDialog = () => {
    this.showFilterTimelineDialog = true
  }

  @action
  closeFilterTimelineDialog = () => {
    this.showFilterTimelineDialog = false
  }

  @action
  openSendCustomDialog = () => {
    this.showSendCustomDialog = true
  }

  @action
  closeSendCustomDialog = () => {
    this.showSendCustomDialog = false
  }

  @action
  reset = () => {
    this.server.commands.all.clear()
  }

  @action
  getStateKeysOrValues = path => {
    if (this.keysOrValues === 'keys') {
      this.getStateKeys(path)
    } else {
      this.getStateValues(path)
    }
  }

  @action
  getStateValues = path => {
    this.server.stateValuesRequest(path)
  }

  @action
  getStateKeys = path => {
    this.server.stateKeysRequest(path)
  }

  @action
  dispatchAction = action => {
    this.server.stateActionDispatch(action)
  }

  @action
  sendCustomMessage = value => {
    this.server.sendCustomMessage(value)
  }

  @action
  setCustomMessage = value => {
    this.customMessage = value
  }

  @action
  toggleKeysValues = () => {
    if (this.keysOrValues === 'keys') {
      this.keysOrValues = 'values'
    } else {
      this.keysOrValues = 'keys'
    }
  }

  @action
  toggleWatchPanel = () => {
    this.showWatchPanel = !this.showWatchPanel
  }

  // grab a copy of the state for backup purposes
  @action backupState = () => this.server.stateBackupRequest()

  // change the state on the app to this
  @action restoreState = state => this.server.stateRestoreRequest(state)

  // removes an existing state object
  @action
  deleteState = state => {
    this.server.commands['state.backup.response'].remove(state)
  }

  getCommandProperty = (messageId, key) => {
    const props = this.commandProperties[messageId]
    if (props) {
      return props.get(key)
    } else {
      this.commandProperties[messageId] = observable(asMap({}))
      return this.commandProperties[messageId].get(key, null)
    }
  }

  @action
  setCommandProperty = (messageId, key, value) => {
    // console.log('setting', messageId, key, value, this.commandProperties)
    if (!this.commandProperties[messageId]) {
      this.commandProperties[messageId] = observable(asMap({}))
    }
    this.commandProperties[messageId].set(key, value)
  }

  /**
   * Asks the client to the file in the editor
   */
  @action openInEditor = (file, lineNumber) => this.server.openInEditor({ file, lineNumber })

  /**
   * Sets the properties of the overlay shown on the React Native app.
   */
  @action setOverlay = props => this.server.send('overlay', props)
}

export default UI
