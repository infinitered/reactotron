import React, { Component } from "react"
import Colors from "../Theme/Colors"
import AppStyles from "../Theme/AppStyles"
import { inject, observer } from "mobx-react"
import SubNavButton from "../Foundation/SubNavButton"

const TITLE = "React Native"
const TITLE_OVERLAY = "Overlay Image"
const TITLE_STORYBOOK = "Storybook"

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
    paddingLeft: 10,
    paddingRight: 10,
    ...AppStyles.Layout.hbox,
  },
  left: {
    ...AppStyles.Layout.hbox,
    flex: 0,
    alignItems: "center",
  },
  right: {
    ...AppStyles.Layout.hbox,
    flex: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  center: {
    ...AppStyles.Layout.hbox,
    flex: 1,
    paddingLeft: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    color: Colors.foregroundLight,
    textAlign: "center",
  },
  titleDivider: {
    width: 1,
    height: "50%",
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: Colors.chromeLine,
  },
  iconSize: 32,
  toolbarAdd: { ...toolbarButton },
  reactNativeIcon: {},
}

@inject("session")
@observer
class NativeHeader extends Component {
  handleImageOverlayPress = () => {
    this.props.session.ui.setNativeSubNav("image")
  }

  handleStorybookPress = () => {
    this.props.session.ui.setNativeSubNav("storybook")
  }

  render() {
    const { ui } = this.props.session
    const { nativeSubNav } = ui

    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.center}>
            <SubNavButton
              icon="camera"
              hideTopBorder
              text="Image Overlay"
              isActive={ui.nativeSubNav === "image"}
              onClick={this.handleImageOverlayPress}
            />
            <SubNavButton
              icon="book"
              hideTopBorder
              text="Storybook"
              isActive={ui.nativeSubNav === "storybook"}
              onClick={this.handleStorybookPress}
            />
          </div>
          <div style={Styles.right} />
        </div>
      </div>
    )
  }
}

export default NativeHeader
