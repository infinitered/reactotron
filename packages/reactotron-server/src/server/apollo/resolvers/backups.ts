// TODO: Pipedream: Offload this to a plugin. In the interest of not having to re-write all the plugins right away with this rewrite of
// reactotron putting this in core. One day lets remove it, ok?
import { Resolver, Query, Subscription, Root, Mutation, Arg } from "type-graphql"

import { messaging, MessageTypes } from "../../messaging"
import { Backup } from "../../schema"
import { backupsStore } from "../../datastore"

@Resolver()
export class BackupsResolver {
  @Query(() => [Backup])
  backups() {
    return backupsStore.all()
  }

  @Mutation()
  setBackupName(
    @Arg("id") id: number,
    @Arg("name") name: string
  ): boolean {
    backupsStore.setBackupName(id, name);
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
  backupRenamed(@Root() updateInfo: { id: number, name: string }): { id: number, name: string } {
    return updateInfo
  }
}
