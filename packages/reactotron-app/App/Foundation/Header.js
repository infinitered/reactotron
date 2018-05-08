import React, { Component } from "react"
import Colors from "../Theme/Colors"
import AppStyles from "../Theme/AppStyles"
import { inject, observer } from "mobx-react"
import SubNavButton from "./SubNavButton"
import SidebarToggleButton from "./SidebarToggleButton"

const toolbarButton = {
  cursor: "pointer",
}

const Styles = {
  container: {
    WebkitAppRegion: "drag",
    backgroundColor: Colors.backgroundSubtleLight,
    borderBottom: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`,
  },
  content: {
    height: 60,
    paddingLeft: 10,
    paddingRight: 10,
    ...AppStyles.Layout.hbox,
    justifyContent: "space-between",
  },
  left: { ...AppStyles.Layout.hbox, width: 100, alignItems: "center" },
  center: {
    ...AppStyles.Layout.hbox,
    flex: 1,
    paddingLeft: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  right: { ...AppStyles.Layout.hbox, justifyContent: "flex-end", alignItems: "center", width: 100 },
  title: {
    color: Colors.foregroundLight,
    textAlign: 'center'
  }
}

@inject("session")
@observer
class Header extends Component {
  render() {
    const {
      session: { ui },
      children,
      tabs,
      title,
      selectedTab,
      onSelectTab
    } = this.props

    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.left}>
            <SidebarToggleButton
              onClick={ui.toggleSidebar}
              isSidebarVisible={ui.isSidebarVisible}
            />
          </div>
          <div style={Styles.center}>
            {tabs
              ? tabs.map(tab => (
                <SubNavButton
                  key={tab.name}
                  icon={tab.icon}
                  hideTopBorder
                  text={tab.text}
                  isActive={selectedTab === tab.name}
                  name={tab.name}
                  onClick={onSelectTab}
                />
              ))
              : <div style={Styles.title}>{title}</div>
            }
          </div>
          <div style={Styles.right}>{children}</div>
        </div>
      </div>
    )
  }
}

export default Header
