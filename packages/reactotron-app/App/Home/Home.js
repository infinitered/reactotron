import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import IconAdd from "react-icons/lib/md/add"
import IconAddBackup from "react-icons/lib/md/file-download"
import IconClear from "react-icons/lib/md/delete-forever"
import Tabs from "../Foundation/Tabs"
import AppStyles from "../Theme/AppStyles"
import Connection from "./HomeConnection"

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
class Home extends Component {
  render() {
    const {
      session: { ui },
    } = this.props

    return (
      <Tabs selectedTab={ui.homeSubNav} onSwitchTab={ui.setHomeSubNav}>
        <Tabs.Tab
          name="connection"
          text="Connections"
          icon="people"
        >
          <Connection />
        </Tabs.Tab>
      </Tabs>
    )
  }
}

export default Home
