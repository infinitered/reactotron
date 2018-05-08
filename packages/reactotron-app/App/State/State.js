import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import IconAdd from "react-icons/lib/md/add"
import IconAddBackup from "react-icons/lib/md/file-download"
import IconClear from "react-icons/lib/md/delete-forever"
import Header from "../Foundation/Header"
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
  handleSelectTab = name => {
    this.props.session.ui.setStateSubNav(name)
  }

  renderActions() {
    const { ui } = this.props.session

    switch (ui.stateSubNav) {
      case "subscriptions":
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
      case "backups":
        return (
          <div>
            <IconAddBackup
              size={Styles.iconSize}
              style={Styles.toolbarAdd}
              onClick={ui.backupState}
            />
          </div>
        )
      default:
        return null
    }
  }

  render() {
    const {
      session: { ui },
    } = this.props

    const showSubscriptions = ui.stateSubNav === "subscriptions"
    const showBackups = ui.stateSubNav === "backups"

    const tabs = [
      {
        icon: "notifications-none",
        text: "Subscriptions",
        name: "subscriptions",
      },
      {
        icon: "import-export",
        text: "Snapshots",
        name: "backups",
      },
    ]

    return (
      <div style={Styles.container}>
        <Header selectedTab={ui.stateSubNav} tabs={tabs} onSelectTab={this.handleSelectTab}>
          {this.renderActions()}
        </Header>
        {showSubscriptions && <Subscriptions />}
        {showBackups && <Backups />}
      </div>
    )
  }
}

export default State
