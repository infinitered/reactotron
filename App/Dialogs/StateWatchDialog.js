import React, { Component } from "react"
import Modal from "react-modal"
import { inject, observer } from "mobx-react"
import AppStyles from "../Theme/AppStyles"

const ESCAPE_KEYSTROKE = "Esc"
const ESCAPE_HINT = "Cancel"
const ENTER_KEYSTROKE = "Enter"
const ENTER_HINT = "Subscribe"
const DIALOG_TITLE = "Add Subscription"
const INPUT_PLACEHOLDER = ""
const FIELD_LABEL = "path"

const INSTRUCTIONS = (
  <div>
    <p>Enter a path you would like to subscribe. Here are some examples to get you started:</p>
    <p style={AppStyles.Modal.example}>user.firstName</p>
    <p style={AppStyles.Modal.example}>repo</p>
    <p style={AppStyles.Modal.example}>repo.*</p>
  </div>
)

@inject("session")
@observer
class StateWatchDialog extends Component {
  handleChange = e => {
    const { session } = this.props
    session.ui.watchToAdd = e.target.value
  }

  onAfterOpenModal = () => this.field.focus()

  render() {
    const { showStateWatchDialog, closeStateWatchDialog } = this.props.session.ui

    return (
      <Modal
        isOpen={showStateWatchDialog}
        style={{
          content: AppStyles.Modal.content,
          overlay: AppStyles.Modal.overlay,
        }}
        onRequestClose={closeStateWatchDialog}
        onAfterOpen={this.onAfterOpenModal}
      >
        <div style={AppStyles.Modal.container}>
          <div style={AppStyles.Modal.header}>
            <h1 style={AppStyles.Modal.title}>{DIALOG_TITLE}</h1>
            <p style={AppStyles.Modal.subtitle}>{INSTRUCTIONS}</p>
          </div>
          <div style={AppStyles.Modal.body}>
            <label style={AppStyles.Modal.fieldLabel}>{FIELD_LABEL}</label>
            <input
              placeholder={INPUT_PLACEHOLDER}
              style={AppStyles.Modal.textField}
              type="text"
              ref={node => (this.field = node)}
              onKeyPress={this.handleKeyPress}
              onChange={this.handleChange}
            />
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

export default StateWatchDialog
