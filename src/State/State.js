import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import IconAdd from "react-icons/lib/md/add"
import IconClear from "react-icons/lib/md/delete-sweep"
import IconAddBackup from "react-icons/lib/md/file-download"
import Tabs from "../Foundation/Tabs"
import AppStyles from "../Theme/AppStyles"
import Backups from "./Backups"
import Subscriptions from "./Subscriptions"
import Button from "../Shared/CommandToolbarButton"

const toolbarButton = {
  cursor: "pointer",
}

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
  toolbarContainer: {
    display: 'flex',
  },
  toolbarAdd: {
    ...toolbarButton,
    marginRight: 7,
  },
  toolbarClear: { ...toolbarButton },
  iconSize: 32,
}

@inject("session")
@observer
class State extends Component {
  renderSubscriptionActions = () => {
    const { ui } = this.props.session

    return (
      <div style={Styles.toolbarContainer}>
        <Button
          icon="add"
          onClick={ui.openStateWatchDialog}
          tip="Add" size={Styles.iconSize}
          style={Styles.toolbarAdd}
        />
        <Button
          icon="delete-sweep"
          onClick={ui.clearStateWatches}
          tip="Clear" size={Styles.iconSize}
          style={Styles.toolbarClear}
        />
      </div>
    )
  }

  render() {
    const {
      session: { ui },
    } = this.props
    const {stateSubNav,setStateSubNav,stateBackupStore} = ui;

    return (
      <Tabs selectedTab={stateSubNav} onSwitchTab={setStateSubNav}>
        <Tabs.Tab
          name="subscriptions"
          text="Subscriptions"
          icon="notifications-none"
          renderActions={this.renderSubscriptionActions}
        >
          <Subscriptions />
        </Tabs.Tab>
        <Tabs.Tab
          name="backups"
          text="Snapshots"
          icon="import-export"
          renderActions={() => (
            <div style={Styles.toolbarContainer}>
              <Button
                icon="call-received"
                onClick={() => stateBackupStore.exportAllBackups()}
                tip="Copy All Backups to Clipboard"
                size={Styles.iconSize}
                style={Styles.toolbarAdd}
              />
              <Button
                icon="file-download"
                onClick={() => stateBackupStore.sendBackup()}
                tip="Add Backup"
                size={Styles.iconSize}
                style={Styles.toolbarAdd}
              />
            </div>
          )}
        >
          <Backups />
        </Tabs.Tab>
      </Tabs>
    )
  }
}

export default State
