import { Provider, observer } from "mobx-react"
import React, { Component } from "react"
import { ipcRenderer } from "electron"
import config from "../Lib/config"
import FilterTimelineDialog from "../Dialogs/FilterTimelineDialog"
import ExportTimelineDialog from "../Dialogs/ExportTimelineDialog"
import RenameStateDialog from "../Dialogs/RenameStateDialog"
import SendCustomDialog from "../Dialogs/SendCustomDialog"
import StateDispatchDialog from "../Dialogs/StateDispatchDialog"
import StateKeysAndValuesDialog from "../Dialogs/StateKeysAndValuesDialog"
import StateWatchDialog from "../Dialogs/StateWatchDialog"
import Home from "../Home/Home"
import Help from "../Help/Help"
import Native from "../Native/Native"
import State from "../State/State"
import SessionStore from "../Stores/SessionStore"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import Timeline from "../Timeline/Timeline"
import Sidebar from "./Sidebar"
import StatusBar from "./StatusBar"
import CustomCommandsList from "../CustomCommands/CustomCommandsList";

const session = new SessionStore(config.get("server.port", 9090))

const Styles = {
  container: { ...AppStyles.Layout.vbox },
  content: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.background,
    color: Colors.foreground,
    height: "100vh",
    scroll: "hidden",
  },
  body: { ...AppStyles.Layout.hbox },
  app: { ...AppStyles.Layout.vbox, scroll: "none", overflow: "hidden" },
  page: { ...AppStyles.Layout.vbox, flex: 1 },
  pageHidden: { flex: 0, height: 0, visibility: "hidden" },
}

@observer
export default class App extends Component {
  componentDidMount() {
    ipcRenderer.on("toggle-side-menu", this.handleSideMenuToggle)
  }

  handleSideMenuToggle() {
    session.ui.toggleSidebar()
  }

  render() {
    const { ui } = session
    const showHome = ui.tab === "home"
    const showTimeline = ui.tab === "timeline"
    const showHelp = ui.tab === "help"
    const showSettings = ui.tab === "settings"
    const showNative = ui.tab === "native"
    const showState = ui.tab === "state"
    const showCustomCommands = ui.tab === "customCommands"

    return (
      <Provider session={session}>
        <div style={Styles.container}>
          <div style={Styles.content}>
            <div style={Styles.body}>
              <Sidebar />
              <div style={Styles.app}>
                <div style={showHome ? Styles.page : Styles.pageHidden}>
                  <Home />
                </div>
                <div style={showTimeline ? Styles.page : Styles.pageHidden}>
                  <Timeline />
                </div>
                <div style={showState ? Styles.page : Styles.pageHidden}>
                  <State />
                </div>
                <div style={showHelp ? Styles.page : Styles.pageHidden}>
                  <Help />
                </div>
                <div style={showNative ? Styles.page : Styles.pageHidden}>
                  <Native />
                </div>
                <div style={showCustomCommands ? Styles.page : Styles.pageHidden}>
                  <CustomCommandsList />
                </div>
                <div style={showSettings ? Styles.page : Styles.pageHidden}>
                  <h1>Settings</h1>
                </div>
              </div>
            </div>
            <StatusBar />
          </div>
          <StateKeysAndValuesDialog />
          <StateDispatchDialog />
          <StateWatchDialog />
          <RenameStateDialog />
          <FilterTimelineDialog />
          <ExportTimelineDialog />
          <SendCustomDialog />
        </div>
      </Provider>
    )
  }
}
