import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import Empty from "../Shared/EmptyState"
import AppStyles from "../Theme/AppStyles"
import BackupItem from "./BackupItem"

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
  backups: {
    margin: 0,
    padding: 0,
    overflowY: "auto",
    overflowX: "hidden",
  },
}

@inject("session")
@observer
class Backups extends Component {
  constructor(props) {
    super(props)
    this.renderBackup = this.renderBackup.bind(this)
  }

  renderEmpty() {
    return (
      <Empty icon="import-export" title="No Snapshots">
        <p>
          To take a snapshot of your current redux or mobx-state-tree store, press the Download
          button in the top right corner of this window.
        </p>
      </Empty>
    )
  }

  handleRemove = backup => {
    const { stateBackupStore } = this.props.session
    stateBackupStore.remove(backup)
  }

  handleRename = backup => {
    const { stateBackupStore } = this.props.session
    stateBackupStore.beginRename(backup)
  }

  handleRestore = backup => {
    const { stateBackupStore } = this.props.session
    stateBackupStore.sendRestore(backup)
  }

  handleExport = backup => {
    const { stateBackupStore } = this.props.session
    stateBackupStore.exportBackup(backup)
  }

  renderBackup(backup) {
    const { id, name } = backup

    return (
      <BackupItem
        key={`backup-${id}-${name}`}
        backup={backup}
        onRemove={this.handleRemove}
        onRename={this.handleRename}
        onRestore={this.handleRestore}
        onExport={this.handleExport}
      />
    )
  }

  render() {
    const { stateBackupStore } = this.props.session
    const backups = stateBackupStore.backups.slice()
    const isEmpty = backups.length === 0
    return (
      <div style={Styles.container}>
        {isEmpty ? (
          this.renderEmpty()
        ) : (
          <div style={Styles.backups}>{backups.map(this.renderBackup)}</div>
        )}
      </div>
    )
  }
}

export default Backups
