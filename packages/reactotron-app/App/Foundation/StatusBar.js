import React, { Component } from "react"
import ExpandIcon from "react-icons/lib/md/swap-vert"
import Colors from "../Theme/Colors"
import AppStyles from "../Theme/AppStyles"
import { inject, observer } from "mobx-react"
import SubNavButton from "./SubNavButton"

const Styles = {
  container: {
    cursor: "pointer",
    backgroundColor: Colors.backgroundSubtleLight,
    borderTop: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`,
  },
  content: {
    backgroundColor: Colors.subtleLine,
    height: 25,
    paddingLeft: 10,
    paddingRight: 10,
    ...AppStyles.Layout.hbox,
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentOpen: {
    height: 85,
  },
  connectionInfo: {
    color: Colors.foregroundLight,
    textAlign: "center",
  },
  connections: {
    ...AppStyles.Layout.hbox,
  },
}

@inject("session")
@observer
class StatusBar extends Component {
  handleOpenStatusBar = () => {
    this.props.session.ui.openStatusBar()
  }

  handleCloseStatusBar = () => {
    this.props.session.ui.closeStatusBar()
  }

  renderCollapsed() {
    const { session } = this.props

    return (
      <div style={Styles.content} onClick={this.handleOpenStatusBar}>
        <div style={Styles.connectionInfo}>port 9090 | {session.connections.length} connections</div>
        <div style={Styles.connectionInfo}>device: android 6.0 sdk 15</div>
        <div>
          <ExpandIcon size={18} />
        </div>
      </div>
    )
  }

  renderExpanded() {
    const { session } = this.props

    return (
      <div style={{ ...Styles.content, ...Styles.contentOpen }}>
        <div style={Styles.connections}>
          {session.connections.map(item => (
            <div>
              {item.platform}
            </div>
          ))}
        </div>
        <div onClick={this.handleCloseStatusBar}>
          <ExpandIcon size={18} />
        </div>
      </div>
    )
  }

  render() {
    const {
      session: { ui },
    } = this.props

    return (
      <div style={Styles.container}>
        {ui.statusBarExpanded ? this.renderExpanded() : this.renderCollapsed()}
      </div>
    )
  }
}

export default StatusBar
