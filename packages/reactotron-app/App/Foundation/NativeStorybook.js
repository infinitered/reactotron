import React, { Component } from "react"
import Colors from "../Theme/Colors"
import AppStyles from "../Theme/AppStyles"
import { inject, observer } from "mobx-react"
import IconChecked from "react-icons/lib/md/radio-button-checked"
import IconUnchecked from "react-icons/lib/md/radio-button-unchecked"
import IconWarning from "react-icons/lib/md/warning"

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
  },
  controls: {
    ...AppStyles.Layout.vbox,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
  storybookLogo: {
    width: 564 / 2,
    height: 152 / 2,
    paddingBottom: 20,
  },
  checkBoxContainer: { ...AppStyles.Layout.hbox, flex: 0, paddingTop: 20 },
  checkBoxItemOn: { ...AppStyles.Layout.hbox, alignItems: "center", flex: 0, paddingRight: 20 },
  checkBoxItemOff: { ...AppStyles.Layout.hbox, alignItems: "center", flex: 0, cursor: "pointer" },
  checkBoxText: { paddingLeft: 3, fontSize: "1.25rem", cursor: "pointer" },
  beta: {
    display: "flex",
    flexDirection: "row",
    color: Colors.warning,
    backgroundColor: Colors.backgroundDarker,
    borderTop: `1px solid ${Colors.chromeLine}`,
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 20,
  },
  warningContainer: {
    paddingRight: 20,
  },
}

const ICON_SIZE = 32
const WARNING_ICON_SIZE = 48

@inject("session")
@observer
class NativeStorybook extends Component {
  render() {
    const { isStorybookShown, enableStorybook, disableStorybook } = this.props.session.ui
    const buttonStyle = isStorybookShown
      ? { ...Styles.button, ...Styles.buttonActive }
      : Styles.button
    const img = isStorybookShown ? "Theme/storybook-logo-color.png" : "Theme/storybook-logo.png"

    return (
      <div style={Styles.container}>
        <div style={Styles.controls}>
          <img src={img} style={Styles.storybookLogo} />

          <div style={Styles.checkBoxContainer}>
            <div style={Styles.checkBoxItemOn} onClick={enableStorybook}>
              {isStorybookShown ? (
                <IconChecked size={ICON_SIZE} />
              ) : (
                <IconUnchecked size={ICON_SIZE} />
              )}
              <span style={Styles.checkBoxText}>On</span>
            </div>
            <div style={Styles.checkBoxItemOff} onClick={disableStorybook}>
              {!isStorybookShown ? (
                <IconChecked size={ICON_SIZE} />
              ) : (
                <IconUnchecked size={ICON_SIZE} />
              )}
              <span style={Styles.checkBoxText}>Off</span>
            </div>
          </div>
        </div>
        <div style={Styles.beta}>
          <div style={Styles.warningContainer}>
            <IconWarning size={WARNING_ICON_SIZE} />
          </div>
          <div>
            <p>
              <strong>Under Construction</strong>
            </p>
            <p>
              This is preview feature. It requires a specific setup of Storybook within React
              Native.
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default NativeStorybook
