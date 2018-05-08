import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import IconAdd from "react-icons/lib/md/add"
import IconAddBackup from "react-icons/lib/md/file-download"
import IconClear from "react-icons/lib/md/delete-forever"
import Tabs from "../Foundation/Tabs"
import AppStyles from "../Theme/AppStyles"
import Overlay from "./NativeOverlay"
import Storybook from "./NativeStorybook"

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
class Native extends Component {
  render() {
    const {
      session: { ui },
    } = this.props

    return (
      <Tabs selectedTab={ui.nativeSubNav} onSwitchTab={ui.setNativeSubNav}>
        <Tabs.Tab
          name="image"
          text="Image Overlay"
          icon="camera"
        >
          <Overlay />
        </Tabs.Tab>
        <Tabs.Tab
          name="storybook"
          text="Storybook"
          icon="book"
        >
          <Storybook />
        </Tabs.Tab>
      </Tabs>
    )
  }
}

export default Native
