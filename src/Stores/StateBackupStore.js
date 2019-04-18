import { format } from "date-fns"
import { action, observable } from "mobx"
import { clipboard } from "electron"

/**
 * The data powering a backup.
 */
export class StateBackupData {
  id
  state
  @observable name

  constructor(id, name, state) {
    this.id = id
    this.name = name
    this.state = state
  }
}

/**
 * Manages the state & actions around state backups.
 */
export class StateBackupStore {
  /** The unique id highwater mark. */
  uniqueIdCounter = 0

  /** A list of the backups. */
  backups = observable.array([], { deep: false })

  /** The id of the backup we are renaming. */
  currentId

  /** The name the user is currently typing in. */
  @observable newBackupName

  /** Are we showing the rename dialog? */
  @observable renameDialogVisible = false

  /**
   * Create an instance.
   *
   * @param server The reactotron server.
   */
  constructor(server) {
    this.server = server

    server.on("command", command => {
      command.type === "state.backup.response" && this.createBackupFromCommand(command)
    })
  }

  /**
   * Exports all backups.
   *
   */
  @action
  exportAllBackups() {
    clipboard.writeText(JSON.stringify(this.backups))
  }

  /**
   * Exports individual backup.
   *
   */
  @action
  exportBackup(currentBackup) {
    clipboard.writeText(JSON.stringify(currentBackup))
  }

  /**
   * Converts a reactotron command into a backup.
   *
   * @param command The reactotron command.
   */
  @action
  createBackupFromCommand(command) {
    this.uniqueIdCounter++

    const id = this.uniqueIdCounter
    const name = command.payload.name || format(new Date(), "dddd @ h:mm:ss a")
    const state = command.payload.state
    const backup = new StateBackupData(id, name, state)

    this.backups.push(backup)
  }

  /**
   * Removes a backup from our list.
   *
   * @param backup The backup to kill.
   */
  @action
  remove(backup) {
    this.backups.indexOf(backup) >= 0 && this.backups.remove(backup)
  }

  /**
   * Ask the app to send us a backup.
   */
  @action
  sendBackup() {
    this.server.send("state.backup.request", {})
  }

  /**
   * Sends a backup to the app so it can switch its internal state to this.
   *
   * @param backup The backup to switch to
   */
  @action
  sendRestore(backup) {
    if (!backup || !backup.state) return

    this.server.send("state.restore.request", { state: backup.state })
  }

  /**
   * Start the flow for renaming a backup.
   *
   * @param backup The backup we are about to rename.
   */
  @action
  beginRename(backup) {
    this.currentId = backup.id
    this.newBackupName = backup.name
    this.renameDialogVisible = true
  }

  /**
   * Save the new name.
   */
  @action
  commitRename() {
    const target = this.backups.find(backup => backup.id === this.currentId)
    if (target) {
      target.name = this.newBackupName
    }
    this.currentId = undefined
    this.newBackupName = ""
    this.renameDialogVisible = false
  }

  /**
   * Set a new name for the backup we're in the process of renaming.
   *
   * @param value The new name.
   */
  @action
  setNewBackupName(value) {
    this.newBackupName = value
  }

  /**
   * Toggles the visibility of the rename dialog.
   * 
   * @param value The new visibility state
   */
  @action
  setRenameDialogVisible(value) {
    this.renameDialogVisible = value
  }

  /**
   * Cancels the renaming workflow.
   */
  @action
  cancelRename() {
    this.setRenameDialogVisible(false)
  }
}
