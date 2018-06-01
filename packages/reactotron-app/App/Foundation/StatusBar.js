import React, { Component } from "react"
import ExpandIcon from "react-icons/lib/md/swap-vert"
import { inject, observer } from "mobx-react"
import Colors from "../Theme/Colors"
import AppStyles from "../Theme/AppStyles"
import { getPlatformName, getPlatformDetails } from "../Lib/platformHelpers"
import SubNavButton from "./SubNavButton"
import DeviceSelector from "./DeviceSelector"

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
    cursor: "auto",
    height: 85,
  },
  connectionInfo: {
    color: Colors.foregroundLight,
    textAlign: "center",
  },
  connections: {
    display: "flex",
    overflowX: "auto",
    overflowY: "hidden",
    flexWrap: "nowrap",
    height: "100%",
  },
  expandIcon: {
    cursor: "pointer",
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

  handleDeviceSelected = device => {
    this.props.session.setSelectedConnection(device)
  }

  renderCollapsed() {
    const { session } = this.props

    let selectedDevice = "Waiting for connection"

    if (session.selectedConnection) {
      selectedDevice = `${getPlatformName(session.selectedConnection)} ${getPlatformDetails(session.selectedConnection)}`
    }

    return (
      <div style={Styles.content} onClick={this.handleOpenStatusBar}>
        <div style={Styles.connectionInfo}>
          port {session.port} | {session.connections.length} connections
        </div>
        <div style={Styles.connectionInfo}>device: {selectedDevice}</div>
        <div style={Styles.expandIcon}>
          <ExpandIcon size={18} />
        </div>
      </div>
    )
  }

  renderExpanded() {
    const { session } = this.props

    let selectedSessionId = -1

    if (session.selectedConnection) {
      selectedSessionId = session.selectedConnection.id
    }

    return (
      <div style={{ ...Styles.content, ...Styles.contentOpen }}>
        <div style={Styles.connections}>
          {session.connections.map(item => (
            <DeviceSelector key={item.id} selectedDeviceId={selectedSessionId} device={item} onSelect={this.handleDeviceSelected} />
          ))}
        </div>
        <div style={Styles.expandIcon} onClick={this.handleCloseStatusBar}>
          <ExpandIcon size={18} />
        </div>
      </div>
    )
  }

  render() {
    const {
      session: { ui },
    } = this.props

    console.log(this.props.session.connections)

    return (
      <div style={Styles.container}>
        {ui.statusBarExpanded ? this.renderExpanded() : this.renderCollapsed()}
      </div>
    )
  }
}

export default StatusBar
