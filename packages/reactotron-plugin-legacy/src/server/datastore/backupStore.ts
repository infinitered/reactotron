import { format } from "date-fns"

import { Backup } from "../apollo/schema"

class Backups {
  backupIdCounter: number = 0
  backups: Backup[] = []

  addBackup(command: any) { // TODO: Get a defintion of command in here somewhere!
    this.backupIdCounter++

    const id = this.backupIdCounter
    const name = command.payload.name || format(new Date(), "dddd @ h:mm:ss a")
    const state = command.payload.state

    this.backups.push({
      id,
      name,
      state,
    })
  }

  setBackupName(backupId: number, name: string) {
    const backup = this.backups.filter(backup => backup.id === backupId);

    if (backup.length < 1) {
      return
    }

    backup[0].name = name
  }

  all() {
    return this.backups
  }
}

const backupsStore = new Backups()

export { backupsStore }
