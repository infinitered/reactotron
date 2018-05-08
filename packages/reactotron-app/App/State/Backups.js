import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import IconRename from "react-icons/lib/md/create"
import IconDelete from "react-icons/lib/md/delete"
import Empty from "../Shared/EmptyState"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import BackupsHeader from "./BackupsHeader"

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
  row: {
    ...AppStyles.Layout.hbox,
    padding: "15px 20px",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${Colors.line}`,
    cursor: "pointer",
  },
  name: {
    color: Colors.tag,
    textAlign: "left",
    flex: 1,
  },
  iconSize: 24,
  upload: {
    paddingRight: 10,
    cursor: "pointer",
  },
  button: {
    cursor: "pointer",
    paddingLeft: 10,
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

  renderBackup(backup) {
    const { stateBackupStore } = this.props.session
    const { id, name, data } = backup

    const remove = event => {
      event.stopPropagation()
      stateBackupStore.remove(backup)
    }
    const rename = event => {
      stateBackupStore.beginRename(backup)
      event.stopPropagation()
    }
    const restore = event => {
      stateBackupStore.sendRestore(backup)
      event.stopPropagation()
    }

    return (
      <div style={Styles.row} key={`backup-${id}`} onClick={restore}>
        <div style={Styles.name}>{name}</div>
        <IconRename size={Styles.iconSize} style={Styles.button} onClick={rename} />
        <IconDelete size={Styles.iconSize} style={Styles.button} onClick={remove} />
      </div>
    )
  }

  render() {
    const { stateBackupStore } = this.props.session
    const backups = stateBackupStore.backups.slice()
    const isEmpty = backups.length === 0
    return (
      <div style={Styles.container}>
        <BackupsHeader />
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
