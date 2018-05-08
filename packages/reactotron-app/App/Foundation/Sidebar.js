import React, { Component } from "react"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import SidebarButton from "./SidebarButton"
import { inject, observer } from "mobx-react"

const logoUrl = require("../Theme/Reactotron-128.png")

const Styles = {
  container: {
    zIndex: 5,
    maxWidth: 115,
    backgroundColor: Colors.backgroundSubtleDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`,
    borderRight: `1px solid ${Colors.chromeLine}`,
    WebkitAppRegion: "drag",
    transition: "margin 0.2s ease-out",
  },
  content: {
    ...AppStyles.Layout.vbox,
    height: "100vh",
    alignItems: "center",
  },
  tabs: {
    paddingTop: 20,
  },
  spacer: {
    flex: 1,
  },
}

@inject("session")
@observer
class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.handleClickTimeline = () => {
      this.props.session.ui.switchTab("timeline")
    }
    this.handleClickState = () => {
      this.props.session.ui.switchTab("state")
    }
    this.handleClickHelp = () => {
      this.props.session.ui.switchTab("help")
    }
    this.handleClickSettings = () => {
      this.props.session.ui.switchTab("settings")
    }
    this.handleClickNative = () => {
      this.props.session.ui.switchTab("native")
    }
  }

  render() {
    const { session } = this.props
    const { ui } = session

    return (
      <div
        style={{
          ...Styles.container,
          ...(!ui.isSidebarVisible ? { marginLeft: -Styles.container.maxWidth } : {}),
        }}
      >
        <div style={Styles.content}>
          <div style={Styles.tabs}>
            <SidebarButton
              text="Timeline"
              icon="reorder"
              hideTopBorder
              isActive={ui.tab === "timeline"}
              onClick={this.handleClickTimeline}
            />
            <SidebarButton
              text="State"
              icon="assignment"
              isActive={ui.tab === "state"}
              onClick={this.handleClickState}
            />
            <SidebarButton
              text="React Native"
              icon="phone-iphone"
              isActive={ui.tab === "native"}
              onClick={this.handleClickNative}
            />
          </div>
          <div style={Styles.spacer} />
          <div>
            <SidebarButton
              text="Help"
              icon="live-help"
              hideTopBorder
              isActive={ui.tab === "help"}
              onClick={this.handleClickHelp}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Sidebar
