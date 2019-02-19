import React, { Component } from "react"
import Checkmark from "react-icons/lib/md/check-circle"
import { getIcon, getPlatformName, getPlatformDetails } from "../Lib/platformHelpers"

const Styles = {
  container: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    marginRight: 20,
    flex: "0 0 auto",
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
  },
  infoContainer: {
    marginLeft: 10,
  },
  checkmark: {
    position: "absolute",
    bottom: -3,
    right: -3,
    color: "green",
  },
}

const ICON_SIZE = 32

class DeviceSelector extends Component {
  handleSelect = () => {
    this.props.onSelect(this.props.device)
  }

  render() {
    const { selectedDeviceClientId, device, showName } = this.props

    const WhichIcon = getIcon(device)

    return (
      <div style={Styles.container} onClick={this.handleSelect}>
        <div style={Styles.iconContainer}>
          <WhichIcon size={ICON_SIZE} />
          {selectedDeviceClientId === device.clientId && (
            <div style={Styles.checkmark}>
              <Checkmark />
            </div>
          )}
        </div>
        <div style={Styles.infoContainer}>
          <div>{getPlatformName(device)}{showName ? ` - ${device.name}` : ''}</div>
          <div>{getPlatformDetails(device)}</div>
        </div>
      </div>
    )
  }
}

export default DeviceSelector
