import { webFrame } from "electron"
import { action, computed, observable } from "mobx"
import { trim } from "ramda"
import { isNilOrEmpty } from "ramdasauce"
import Keystroke from "../Lib/Keystroke"
import Mousetrap from "mousetrap"
import fs from "fs"

/**
 * Handles UI state.
 */
class UI {
  @observable tab = "timeline"
  @observable homeSubNav = "connections"
  @observable stateSubNav = "subscriptions"
  @observable nativeSubNav = "image"
  @observable keysOrValues = "keys"
  @observable showStateFindDialog = false
  @observable showStateDispatchDialog = false
  @observable showHelpDialog = false
  @observable showStateWatchDialog = false
  @observable showFilterTimelineDialog = false
  @observable showTimelineExportDialog = false
  @observable statusBarExpanded = false
  @observable watchToAdd
  @observable actionToDispatch
  @observable showWatchPanel = false
  @observable customMessage = ""
  @observable showSendCustomDialog = false
  @observable isTimelineSearchVisible = false
  @observable isTimelineOrderReversed =
    JSON.parse(localStorage.getItem("isTimelineOrderReversed")) || false
  @observable isSidebarVisible = true
  @observable isStorybookShown = false
  @observable searchPhrase = ""
  @observable exportFilePath = ""
  @observable writingFileError = ""
  @observable writingFileSuccess = false
  @observable inTerminal = false
  zoomLevel = 0

  // additional properties that some commands may want... a way to communicate
  // from the command toolbar to the command
  commandProperties = {}

  constructor(
    session,
    server,
    commandsManager,
    stateBackupStore,
    getSelectedConnection,
    addSubscription,
    removeSubscription,
    clearSubscriptions
  ) {
    this.session = session
    this.server = server
    this.commandsManager = commandsManager
    this.stateBackupStore = stateBackupStore
    this.getSelectedConnection = getSelectedConnection
    this.addSubscription = addSubscription
    this.removeSubscription = removeSubscription
    this.clearSubscriptions = clearSubscriptions

    Mousetrap.prototype.stopCallback = () => false

    Mousetrap.bind(`${Keystroke.mousetrap}+backspace`, this.reset)
    Mousetrap.bind(`${Keystroke.mousetrap}+k`, this.openStateFindDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+shift+f`, this.openFilterTimelineDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+shift+e`, this.openExportTimelineDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+d`, this.openStateDispatchDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+s`, () => this.stateBackupStore.sendBackup())
    Mousetrap.bind(`tab`, this.toggleKeysValues)
    Mousetrap.bind(`escape`, this.popState)
    Mousetrap.bind(`enter`, this.submitCurrentForm)
    Mousetrap.bind(`${Keystroke.mousetrap}+enter`, this.submitCurrentFormDelicately)
    Mousetrap.bind(`${Keystroke.mousetrap}+n`, this.openStateWatchDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+1`, this.switchTab.bind(this, "home"))
    Mousetrap.bind(`${Keystroke.mousetrap}+2`, this.switchTab.bind(this, "timeline"))
    Mousetrap.bind(`${Keystroke.mousetrap}+3`, this.switchTab.bind(this, "state"))
    Mousetrap.bind(`${Keystroke.mousetrap}+4`, this.switchTab.bind(this, "native"))
    Mousetrap.bind(`${Keystroke.mousetrap}+?`, this.switchTab.bind(this, "help"))
    Mousetrap.bind(`${Keystroke.mousetrap}+f`, this.showTimelineSearch)
    Mousetrap.bind(`${Keystroke.mousetrap}+.`, this.openSendCustomDialog)
    Mousetrap.bind(`${Keystroke.mousetrap}+shift+s`, this.toggleSidebar)
    Mousetrap.bind(`${Keystroke.mousetrap}+-`, this.zoomOut.bind(this))
    Mousetrap.bind(`${Keystroke.mousetrap}+=`, this.zoomIn.bind(this))
    Mousetrap.bind(`${Keystroke.mousetrap}+0`, this.resetZoom.bind(this))
    Mousetrap.bind(`${Keystroke.mousetrap}+a ${Keystroke.mousetrap}+a ${Keystroke.mousetrap}+a ${Keystroke.mousetrap}+a`, this.openTerminal.bind(this, true))
  }

  @action
  openTerminal(open) {
    this.inTerminal = open
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
  toggleTimelineOrder = () => {
    this.isTimelineOrderReversed = !this.isTimelineOrderReversed
    localStorage.setItem("isTimelineOrderReversed", JSON.stringify(this.isTimelineOrderReversed))
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
      this.showTimelineExportDialog ||
      this.stateBackupStore.renameDialogVisible ||
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
    if (this.showTimelineExportDialog) {
      this.exportCommands()
    }
  }

  @action
  submitStateWatch = () => {
    this.addSubscription(this.watchToAdd)
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
    this.removeSubscription(path)
  }

  @action
  clearStateWatches = () => {
    this.clearSubscriptions()
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
  openExportTimelineDialog = () => {
    this.showTimelineExportDialog = true
  }

  @action
  closeExportTimelineDialog = () => {
    this.showTimelineExportDialog = false
    this.exportFilePath = ""
    this.writingFileError = ""
    this.writingFileSuccess = false
  }

  @action
  setExportFilePath = path => {
    this.exportFilePath = path
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
  openStatusBar = () => {
    this.statusBarExpanded = true
  }

  @action
  closeStatusBar = () => {
    this.statusBarExpanded = false
  }

  @action
  reset = () => {
    const selectedConnection = this.getSelectedConnection()

    if (!selectedConnection) return

    this.commandsManager.clearClientsCommands(selectedConnection.clientId)
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
    const selectedConnection = this.getSelectedConnection()

    if (!selectedConnection) return

    this.server.sendCustomMessage(value, selectedConnection.clientId)
  }

  @action
  sendCustomMessageWithArgs = (command, args) => {
    const selectedConnection = this.getSelectedConnection()

    if (!selectedConnection) return

    this.server.sendCustomMessage({ command, args }, selectedConnection.clientId)
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

  @action reloadNative = () => this.server.send("devtools.reload")
  @action openDevMenuNative = () => this.server.send("devtools.open")

  /**
   * Toggles storybook
   */
  @action
  toggleStorybook = () => {
    this.isStorybookShown = !this.isStorybookShown

    this.server.send("storybook", this.isStorybookShown)
  }

  /**
   * Turn on storybook for the current client.
   */
  @action
  enableStorybook = () => {
    if (this.isStorybookShown) return
    this.isStorybookShown = true
    this.sendStorybookState()
  }

  /**
   * Turn off storybook for the current client.
   */
  @action
  disableStorybook = () => {
    if (!this.isStorybookShown) return
    this.isStorybookShown = false
    this.sendStorybookState()
  }

  /**
   * Sends the current storybook state to the app.
   */
  sendStorybookState = clientId => {
    this.server.send("storybook", this.isStorybookShown, clientId)
  }

  exportCommands = () => {
    if (!this.exportFilePath) {
      this.writingFileError = "Please choose a path."
      return
    }
    const formatCommand = command => ({
      time: command.date,
      clientId: command.clientId,
      payload: {
        name: command.payload.name,
        action: command.payload.action,
      },
      type: command.type,
    })

    const commands = JSON.stringify(this.session.commands.map(formatCommand))
    fs.writeFile(this.exportFilePath + "/reactotron_timeline.txt", commands, err => {
      if (err) {
        console.log(err)
        this.writingFileError = err.message
      } else {
        this.writingFileSuccess = true
        this.writingFileError = ""
      }
    })
  }

  replResponse(response) {
    if (this.replResponseHandler) {
      this.replResponseHandler(response)
    }
  }

  replResponseHandler = null
}

export default UI
