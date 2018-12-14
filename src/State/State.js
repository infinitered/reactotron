import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import IconAdd from "react-icons/lib/md/add"
import IconClear from "react-icons/lib/md/delete-sweep"
import IconAddBackup from "react-icons/lib/md/file-download"
import Tabs from "../Foundation/Tabs"
import AppStyles from "../Theme/AppStyles"
import Backups from "./Backups"
import Subscriptions from "./Subscriptions"
import Tooltip from "../Shared/Tooltip"

const toolbarButton = {
  cursor: "pointer",
}

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
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
      <div>
        <Tooltip className="tooltipTheme" place="bottom" tip="Add">
          <IconAdd
            size={Styles.iconSize}
            style={Styles.toolbarAdd}
            onClick={ui.openStateWatchDialog}
          />
        </Tooltip>
        <Tooltip className="tooltipTheme" place="bottom" tip="Clear">
        <IconClear
          size={Styles.iconSize}
          style={Styles.toolbarClear}
          onClick={ui.clearStateWatches}
        />
        </Tooltip>
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
          renderActions={() => (
            <div>
              <IconAddBackup
                size={Styles.iconSize}
                style={Styles.toolbarAdd}
                onClick={() => ui.stateBackupStore.sendBackup()}
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
