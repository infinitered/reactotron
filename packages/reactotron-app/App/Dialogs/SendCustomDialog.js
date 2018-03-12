import React, { Component } from "react"
import ReactDOM from "react-dom"
import Modal from "react-modal"
import { inject, observer } from "mobx-react"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import { shell } from "electron"

const ESCAPE_KEYSTROKE = "Esc"
const ESCAPE_HINT = "Cancel"
const ENTER_KEYSTROKE = "Enter"
const ENTER_HINT = "Send"
const DIALOG_TITLE = "Custom Command"

const INPUT_PLACEHOLDER = ""
const FIELD_LABEL = "command"

const Styles = {
  moreInfo: {
    paddingTop: "1em",
    fontSize: 12,
    color: Colors.foreground,
  },
  link: {
    textDecoration: "none",
    color: "white",
    cursor: "pointer",
  },
}

const INSTRUCTIONS = <p>Sends a custom command to your app.</p>

@inject("session")
@observer
class SendCustomDialog extends Component {
  handleChange = e => {
    const { session } = this.props
    session.ui.setCustomMessage(e.target.value)
  }

  onMoreInfo = e => {
    shell.openExternal(
      "https://github.com/infinitered/reactotron/blob/master/docs/tips.md#custom-commands"
    )
    e.preventDefault()
  }

  onAfterOpenModal = () => this.field.focus()

  render() {
    const { ui } = this.props.session

    return (
      <Modal
        isOpen={ui.showSendCustomDialog}
        onRequestClose={ui.closeSendCustomDialog}
        onAfterOpen={this.onAfterOpenModal}
        style={{
          content: AppStyles.Modal.content,
          overlay: AppStyles.Modal.overlay,
        }}
      >
        <div style={AppStyles.Modal.container}>
          <div style={AppStyles.Modal.header}>
            <h1 style={AppStyles.Modal.title}>{DIALOG_TITLE}</h1>
            <div style={AppStyles.Modal.subtitle}>{INSTRUCTIONS}</div>
          </div>
          <div style={AppStyles.Modal.body}>
            <label style={AppStyles.Modal.fieldLabel}>{FIELD_LABEL}</label>
            <input
              placeholder={INPUT_PLACEHOLDER}
              style={AppStyles.Modal.textField}
              type="text"
              ref={node => (this.field = node)}
              value={ui.customMessage}
              onKeyPress={this.handleKeyPress}
              onChange={this.handleChange}
            />
            <small style={Styles.moreInfo}>
              See{" "}
              <a style={Styles.link} onClick={this.onMoreInfo}>
                this tip
              </a>{" "}
              for creating your own middleware.
            </small>
          </div>

          <div style={AppStyles.Modal.keystrokes}>
            <div style={AppStyles.Modal.hotkey}>
              <span style={AppStyles.Modal.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
            </div>
            <div style={AppStyles.Modal.hotkey}>
              <span style={AppStyles.Modal.keystroke}>{ENTER_KEYSTROKE}</span> {ENTER_HINT}
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default SendCustomDialog
