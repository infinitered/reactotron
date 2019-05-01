import { inject, observer } from "mobx-react"
import React, { Component } from "react"
import Tabs from "../Foundation/Tabs"
import AppStyles from "../Theme/AppStyles"
import Overlay from "./NativeOverlay"
import Storybook from "./NativeStorybook"
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
  toolbarAdd: { ...toolbarButton },
  toolbarClear: { ...toolbarButton },
  iconSize: 32,
}

@inject("session")
@observer
class Native extends Component {
  renderActions = () => {
    const { session: { ui } } = this.props

    return (
      <div style={Styles.toolbarContainer}>
        <Button
          icon="cached"
          onClick={ui.reloadNative}
          tip="Reload"
          size={Styles.iconSize}
          style={Styles.toolbarAdd}
        />
        <Button
          icon="developer-mode"
          onClick={ui.openDevMenuNative}
          tip="Open Dev Menu"
          size={Styles.iconSize}
          style={Styles.toolbarAdd}
        />
      </div>
    )
  }

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
          renderActions={this.renderActions}
        >
          <Overlay />
        </Tabs.Tab>
        <Tabs.Tab
          name="storybook"
          text="Storybook"
          icon="book"
          renderActions={this.renderActions}
        >
          <Storybook />
        </Tabs.Tab>
      </Tabs>
    )
  }
}

export default Native
