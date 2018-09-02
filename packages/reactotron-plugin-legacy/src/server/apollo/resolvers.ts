import { Resolver, Query, Mutation, Arg, Int, Subscription, Root } from "type-graphql"
import { messaging } from "reactotron-core-plugin"

import * as MessageTypes from "../types"
import { Backup } from "./schema"
import { backupsStore } from "../datastore/backupStore"

@Resolver()
export class BackupsResolver {
  @Query(() => [Backup])
  backups() {
    return backupsStore.all()
  }

  @Mutation()
  setBackupName(
    @Arg("id", () => Int)
    id: number,
    @Arg("name") name: string,
  ): boolean {
    backupsStore.setBackupName(id, name)
    messaging.publish(MessageTypes.BACKUP_RENAMED, { id, name })

    return true
  }

  @Subscription(() => Backup, {
    topics: [MessageTypes.BACKUP_ADDED],
  })
  backupAdded(@Root() backup: Backup): Backup {
    return backup
  }

  @Subscription(() => Backup, {
    topics: [MessageTypes.BACKUP_RENAMED],
  })
  backupRenamed(@Root() updateInfo: { id: number; name: string }): { id: number; name: string } {
    return updateInfo
  }
}
