import { observer } from "mobx-react"
import React, { Component } from "react"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import { getIcon, getPlatformName, getPlatformDetails, getScreen } from "../Lib/platformHelpers"

const Styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    marginTop: 0,
    alignItems: "center",
    borderBottom: `1px solid ${Colors.line}`,
    paddingTop: 10,
    paddingBottom: 10,
  },
  icon: {
    color: Colors.foregroundLight,
  },
  platform: {
    paddingLeft: 10,
    color: Colors.tag,
    width: "25%",
  },
  platformDetails: {
    borderLeft: `1px solid ${Colors.subtleLine}`,
    color: Colors.foregroundDark,
    paddingLeft: 10,
    marginLeft: 10,
  },
  screen: {
    borderLeft: `1px solid ${Colors.subtleLine}`,
    paddingLeft: 10,
    marginLeft: 10,
    color: Colors.backgroundHighlight,
  },
}

const ICON_SIZE = 32

@observer
class ConnectionCell extends Component {
  render() {
    const { connection = {} } = this.props
    const { platform = "?" } = connection
    const WhichIcon = getIcon(connection)

    return (
      <div style={Styles.container} key={connection.key}>
        <div style={Styles.icon}>
          <WhichIcon size={ICON_SIZE} />
        </div>
        <div style={Styles.platform}>{getPlatformName(connection)}</div>
        <div style={Styles.platformDetails}>{getPlatformDetails(connection)}</div>
        <div style={Styles.screen}>{getScreen(connection)}</div>
      </div>
    )
  }
}

export default ConnectionCell
