import { Provider, observer } from "mobx-react"
import React, { Component } from "react"
import FilterTimelineDialog from "../Dialogs/FilterTimelineDialog"
import RenameStateDialog from "../Dialogs/RenameStateDialog"
import SendCustomDialog from "../Dialogs/SendCustomDialog"
import StateDispatchDialog from "../Dialogs/StateDispatchDialog"
import StateKeysAndValuesDialog from "../Dialogs/StateKeysAndValuesDialog"
import StateWatchDialog from "../Dialogs/StateWatchDialog"
import Help from "../Help/Help"
import NativeHeader from "../Native/NativeHeader"
import NativeOverlay from "../Native/NativeOverlay"
import NativeStorybook from "../Native/NativeStorybook"
import Backups from "../State/Backups"
import Subscriptions from "../State/Subscriptions"
import SessionStore from "../Stores/SessionStore"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import Timeline from "../Timeline/Timeline"
import Sidebar from "./Sidebar"

const session = new SessionStore()

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
  render() {
    const { ui } = session
    const showTimeline = ui.tab === "timeline"
    const showSubscriptions = ui.tab === "subscriptions"
    const showHelp = ui.tab === "help"
    const showSettings = ui.tab === "settings"
    const showBackups = ui.tab === "backups"
    const showNative = ui.tab === "native"
    const showOverlay = ui.nativeSubNav === "image"
    const showStorybook = ui.nativeSubNav === "storybook"

    return (
      <Provider session={session}>
        <div style={Styles.container}>
          <div style={Styles.content}>
            <div style={Styles.body}>
              <Sidebar />
              <div style={Styles.app}>
                <div style={showTimeline ? Styles.page : Styles.pageHidden}>
                  <Timeline />
                </div>
                <div style={showSubscriptions ? Styles.page : Styles.pageHidden}>
                  <Subscriptions />
                </div>
                <div style={showBackups ? Styles.page : Styles.pageHidden}>
                  <Backups />
                </div>
                <div style={showHelp ? Styles.page : Styles.pageHidden}>
                  <Help />
                </div>
                <div style={showNative ? Styles.page : Styles.pageHidden}>
                  <NativeHeader />
                  {showOverlay && <NativeOverlay />}
                  {showStorybook && <NativeStorybook />}
                </div>
                <div style={showSettings ? Styles.page : Styles.pageHidden}>
                  <h1>Settings</h1>
                </div>
              </div>
            </div>
          </div>
          <StateKeysAndValuesDialog />
          <StateDispatchDialog />
          <StateWatchDialog />
          <RenameStateDialog />
          <FilterTimelineDialog />
          <SendCustomDialog />
        </div>
      </Provider>
    )
  }
}
