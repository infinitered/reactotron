import { webFrame } from "electron"
import { action, computed, observable } from "mobx"
import { trim } from "ramda"
import { isNilOrEmpty } from "ramdasauce"
import Keystroke from "../Lib/Keystroke"
import Mousetrap from "../Lib/Mousetrap.min.js"

/**
 * Handles UI state.
 */
class UI {
  @observable tab = "timeline"
  @observable homeSubNav = "connection"
  @observable stateSubNav = "subscriptions"
  @observable nativeSubNav = "image"
  @observable keysOrValues = "keys"
  @observable showStateFindDialog = false
  @observable showStateDispatchDialog = false
  @observable showHelpDialog = false
  @observable showStateWatchDialog = false
  @observable showFilterTimelineDialog = false
  @observable showConnectionSelectionDialog = false
  @observable watchToAdd
  @observable actionToDispatch
  @observable showWatchPanel = false
  @observable customMessage = ""
  @observable showSendCustomDialog = false
  @observable isTimelineSearchVisible = false
  @observable isSidebarVisible = true
  @observable isStorybookShown = false
  @observable searchPhrase = ""
  zoomLevel = 0

  // additional properties that some commands may want... a way to communicate
  // from the command toolbar to the command
  commandProperties = {}

  constructor(server, commandsManager, stateBackupStore) {
    this.server = server
    this.commandsManager = commandsManager
    this.stateBackupStore = stateBackupStore

    Mousetrap.prototype.stopCallback = () => false

    Mousetrap.bind(`${Keystroke.mousetrap}+backspace`, this.reset)
    Mousetrap.bind(`${Keystroke.mousetrap}+k`, this.openStateFindDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+shift+f`, this.openFilterTimelineDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+d`, this.openStateDispatchDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+s`, () => this.stateBackupStore.sendBackup())
    Mousetrap.bind(`tab`, this.toggleKeysValues)
    Mousetrap.bind(`escape`, this.popState)
    Mousetrap.bind(`enter`, this.submitCurrentForm)
    Mousetrap.bind(`${Keystroke.mousetrap}+enter`, this.submitCurrentFormDelicately)
    Mousetrap.bind(`${Keystroke.mousetrap}+n`, this.openStateWatchDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+1`, this.switchTab.bind(this, "timeline"))
    Mousetrap.bind(`${Keystroke.mousetrap}+2`, this.switchTab.bind(this, "state"))
    Mousetrap.bind(`${Keystroke.mousetrap}+3`, this.switchTab.bind(this, "native"))
    Mousetrap.bind(`${Keystroke.mousetrap}+?`, this.switchTab.bind(this, "help"))
    Mousetrap.bind(`${Keystroke.mousetrap}+f`, this.showTimelineSearch)
    Mousetrap.bind(`${Keystroke.mousetrap}+.`, this.openSendCustomDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+shift+s`, this.toggleSidebar)
    Mousetrap.bind(`${Keystroke.mousetrap}+-`, this.zoomOut.bind(this))
    Mousetrap.bind(`${Keystroke.mousetrap}+=`, this.zoomIn.bind(this))
    Mousetrap.bind(`${Keystroke.mousetrap}+0`, this.resetZoom.bind(this))
  }

  zoomOut() {
    this.zoomLevel--
    webFrame.setZoomLevel(this.zoomLevel)
  }

  zoomIn() {
    this.zoomLevel++
    webFrame.setZoomLevel(this.zoomLevel)
  }

  resetZoom() {
    this.zoomLevel = 0
    webFrame.setZoomLevel(this.zoomLevel)
  }

  @action
  setSearchPhrase = value => {
    this.searchPhrase = value
  }

  /**
   * Get the scrubbed search phrase.
   */
  @computed
  get cleanedSearchPhrase() {
    return trim(this.searchPhrase || "")
  }

  /**
   * The regular expression we will be using to search commands.
   */
  @computed
  get searchRegexp() {
    try {
      return new RegExp(this.cleanedSearchPhrase.replace(/\s/, "."), "i")
    } catch (e) {
      return null
    }
  }

  /**
   * Is this search phrase useable?
   */
  @computed
  get isValidSearchPhrase() {
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
    this.switchTab("timeline")
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
  hideSidebar = () => {
    this.isSidebarVisible = false
  }

  @action
  showSidebar = () => {
    this.isSidebarVisible = true
  }

  @action
  toggleSidebar = () => {
    if (this.isSidebarVisible) {
      this.hideSidebar()
    } else {
      this.showSidebar()
    }
  }

  @action
  switchTab = newTab => {
    this.tab = newTab
  }

  @action
  setHomeSubNav = value => {
    this.homeSubNav = value
  }

  @action
  setStateSubNav = value => {
    this.stateSubNav = value
  }

  @action
  setNativeSubNav = value => {
    this.nativeSubNav = value
  }

  @computed
  get isModalShowing() {
    return (
      this.showStateWatchDialog ||
      this.showStateFindDialog ||
      this.showStateDispatchDialog ||
      this.showFilterTimelineDialog ||
      this.stateBackupStore.renameDialogVisible ||
      this.showSendCustomDialog ||
      this.showConnectionSelectionDialog
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
    } else if (this.stateBackupStore.renameDialogVisible) {
      this.stateBackupStore.commitRename()
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
  submitCurrentMessage = () => {
    this.sendCustomMessage(this.customMessage)
    this.customMessage = ""
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
  setActionToDispatch(action) {
    this.actionToDispatch = action
    this.showStateDispatchDialog = true
  }

  @action
  submitStateDispatch = () => {
    // try not to blow up the frame
    let action = null
    try {
      // brackets are need on chromium side, huh.
      action = eval("(" + this.actionToDispatch + ")") // eslint-disable-line
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
  openConnectionSelectionDialog = () => {
    this.showConnectionSelectionDialog = true
  }

  @action
  closeConnectionSelectionDialog = () => {
    this.showConnectionSelectionDialog = false
  }

  @action
  reset = () => {
    this.commandsManager.all.clear()
  }

  @action
  getStateKeysOrValues = path => {
    if (this.keysOrValues === "keys") {
      this.getStateKeys(path)
    } else {
      this.getStateValues(path)
    }
  }

  @action
  getStateValues = path => {
    this.server.send("state.values.request", { path })
  }

  @action
  getStateKeys = path => {
    this.server.send("state.keys.request", { path })
  }

  @action
  dispatchAction = action => {
    this.server.send("state.action.dispatch", { action })
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
    if (this.keysOrValues === "keys") {
      this.keysOrValues = "values"
    } else {
      this.keysOrValues = "keys"
    }
  }

  @action
  toggleWatchPanel = () => {
    this.showWatchPanel = !this.showWatchPanel
  }

  getCommandProperty = (messageId, key) => {
    const props = this.commandProperties[messageId]
    if (props) {
      return props.get(key)
    } else {
      this.commandProperties[messageId] = observable.map({})
      return this.commandProperties[messageId].get(key, null)
    }
  }

  @action
  setCommandProperty = (messageId, key, value) => {
    if (!this.commandProperties[messageId]) {
      this.commandProperties[messageId] = observable.map({})
    }
    this.commandProperties[messageId].set(key, value)
  }

  /**
   * Asks the client to the file in the editor
   */
  @action openInEditor = (file, lineNumber) => this.server.send("editor.open", { file, lineNumber })

  /**
   * Sets the properties of the overlay shown on the React Native app.
   */
  @action setOverlay = props => this.server.send("overlay", props)

  /**
   * Toggles storybook
   */
  @action
  toggleStorybook = () => {
    this.isStorybookShown = !this.isStorybookShown

    this.server.send("storybook", this.isStorybookShown)
  }

  @action
  enableStorybook = () => {
    if (this.isStorybookShown) return
    this.isStorybookShown = true
    this.server.send("storybook", this.isStorybookShown)
  }

  @action
  disableStorybook = () => {
    if (!this.isStorybookShown) return
    this.isStorybookShown = false
    this.server.send("storybook", this.isStorybookShown)
  }
}

export default UI
