import React, { Component } from "react"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import SidebarButton from "./SidebarButton"
import { inject, observer } from "mobx-react"
import { MdReorder, MdAssignment, MdPhoneIphone, MdLiveHelp } from "react-icons/md"
import { FaMagic } from "react-icons/fa"

const logoUrl = require("../Theme/Reactotron-128.png")

const Styles = {
  container: {
    zIndex: 5,
    maxWidth: 115,
    backgroundColor: Colors.backgroundSubtleDark,
    // boxShadow: `0px 0px 30px ${Colors.glow}`,
    borderRight: `1px solid ${Colors.chromeLine}`,
    WebkitAppRegion: "drag",
    transition: "margin 0.2s ease-out",
  },
  content: { ...AppStyles.Layout.vbox, height: "100%", alignItems: "center" },
  tabs: { paddingTop: 20 },
  spacer: { flex: 1 },
  logo: { width: 32, height: 32, paddingBottom: 4 },
}

@inject("session")
@observer
class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.handleClickHome = () => {
      this.props.session.ui.switchTab("home")
    }
    this.handleClickTimeline = () => {
      this.props.session.ui.switchTab("timeline")
    }
    this.handleClickState = () => {
      this.props.session.ui.switchTab("state")
    }
    this.handleClickHelp = () => {
      this.props.session.ui.switchTab("help")
    }
    this.handleClickNative = () => {
      this.props.session.ui.switchTab("native")
    }
    this.handleClickCustomCommands = () => {
      this.props.session.ui.switchTab("customCommands")
    }
  }

  render() {
    const { session } = this.props
    const { ui } = session
    const isHome = ui.tab === "home"
    const imageFilter = {
      filter: `grayscale(${isHome ? 0 : 100}%) brightness(${isHome ? 100 : 70}%)`,
    }

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
              text="Home"
              hideTopBorder
              isActive={isHome}
              onClick={this.handleClickHome}
            >
              <img src={logoUrl} style={{ ...Styles.logo, ...imageFilter }} />
            </SidebarButton>
            <SidebarButton
              text="Timeline"
              icon={MdReorder}
              isActive={ui.tab === "timeline"}
              onClick={this.handleClickTimeline}
            />
            <SidebarButton
              text="State"
              icon={MdAssignment}
              isActive={ui.tab === "state"}
              onClick={this.handleClickState}
            />
            <SidebarButton
              text="React Native"
              icon={MdPhoneIphone}
              isActive={ui.tab === "native"}
              onClick={this.handleClickNative}
            />
            <SidebarButton
              text="Custom Commands"
              icon={FaMagic}
              isActive={ui.tab === "customCommands"}
              onClick={this.handleClickCustomCommands}
            />
          </div>
          <div style={Styles.spacer} />
          <div>
            <SidebarButton
              text="Help"
              icon={MdLiveHelp}
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
