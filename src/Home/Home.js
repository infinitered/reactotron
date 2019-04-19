import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import {
  MdAdd as IconAdd,
  MdFileDownload as IconAddBackup,
  MdDeleteForever as IconClear,
  MdPeople,
} from "react-icons/md"
import Tabs from "../Foundation/Tabs"
import AppStyles from "../Theme/AppStyles"
import Connections from "./Connections"

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
        <Tabs.Tab name="connections" text="Connections" icon={MdPeople}>
          <Connections />
        </Tabs.Tab>
      </Tabs>
    )
  }
}

export default Home
