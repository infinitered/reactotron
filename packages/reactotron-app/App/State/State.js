import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import IconAdd from "react-icons/lib/md/add"
import IconAddBackup from "react-icons/lib/md/file-download"
import IconClear from "react-icons/lib/md/delete-forever"
import Tabs from "../Foundation/Tabs"
import AppStyles from "../Theme/AppStyles"
import Subscriptions from "./Subscriptions"
import Backups from "./Backups"

const toolbarButton = {
  cursor: "pointer",
}

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
  toolbarAdd: { ...toolbarButton },
  toolbarClear: { ...toolbarButton },
  iconSize: 32,
}

@inject("session")
@observer
class State extends Component {
  renderSubscriptionActions = () => {
    const { ui } = this.props.session

    return (
      <div>
        <IconAdd
          size={Styles.iconSize}
          style={Styles.toolbarAdd}
          onClick={ui.openStateWatchDialog}
        />
        <IconClear
          size={Styles.iconSize}
          style={Styles.toolbarClear}
          onClick={ui.clearStateWatches}
        />
      </div>
    )
  }

  renderBackupsActions = () => {
    const { ui } = this.props.session

    return (
      <div>
        <IconAddBackup size={Styles.iconSize} style={Styles.toolbarAdd} onClick={ui.backupState} />
      </div>
    )
  }

  render() {
    const {
      session: { ui },
    } = this.props

    return (
      <Tabs selectedTab={ui.stateSubNav} onSwitchTab={ui.setStateSubNav}>
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
          renderActions={this.renderBackupsActions}
        >
          <Backups />
        </Tabs.Tab>
      </Tabs>
    )
  }
}

export default State
