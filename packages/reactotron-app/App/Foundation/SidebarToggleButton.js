import React from "react"
import IconArrowBack from "react-icons/lib/md/arrow-back"

const Styles = {
  iconSize: 24,
  sidebarIcon: {
    paddingRight: 7,
    cursor: "pointer",
    transition: "transform 0.2s ease-in 0.2s, margin 0.2s",
  },
  sidebarHiddenIcon: { transform: "rotate(0.5turn)", marginTop: 0 },
}

const SidebarToggleButton = props => {
  const sidebarIconStyle = {
    ...Styles.sidebarIcon,
    ...(props.isSidebarVisible ? {} : Styles.sidebarHiddenIcon),
  }

  return <IconArrowBack size={Styles.iconSize} style={sidebarIconStyle} onClick={props.onClick} />
}

export default SidebarToggleButton
