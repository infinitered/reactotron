import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import {
  MdAdd as IconAdd,
  MdFileDownload as IconAddBackup,
  MdDeleteForever as IconClear,
  MdCamera,
  MdBook
} from "react-icons/md"
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
          icon={MdCamera}
        >
          <Overlay />
        </Tabs.Tab>
        <Tabs.Tab
          name="storybook"
          text="Storybook"
          icon={MdBook}
        >
          <Storybook />
        </Tabs.Tab>
      </Tabs>
    )
  }
}

export default Native
