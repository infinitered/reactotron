// TODO: Pipedream: Offload this to a plugin. In the interest of not having to re-write all the plugins right away with this rewrite of
// reactotron putting this in core. One day lets remove it, ok?
import { format } from "date-fns"

import { Backup, Command } from "../schema"

export class Backups {
  backupIdCounter: number = 0
  backups: Backup[] = []

  addBackup(command: Command) {
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
