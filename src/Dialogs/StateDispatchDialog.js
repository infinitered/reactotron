import React, { Component } from "react"
import Modal from "react-modal"
import { inject, observer } from "mobx-react"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import Keystroke from "../Lib/Keystroke"

const ESCAPE_KEYSTROKE = "Esc"
const ESCAPE_HINT = "Cancel"
const ENTER_KEYSTROKE = `${Keystroke.modifierName} + Enter`
const ENTER_HINT = "Dispatch"
const DIALOG_TITLE = "Dispatch Action"
const INSTRUCTIONS = <span> Create an action that will be dispatched to the client to run.</span>
const INPUT_PLACEHOLDER = "{ type: 'RepoMessage.Request' }"
const FIELD_LABEL = "Action"

const Styles = {
  dispatchField: {
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: `1px solid ${Colors.line}`,
    fontSize: 23,
    color: Colors.foregroundLight,
    backgroundColor: "inherit",
    height: 200,
  },
}

@inject("session")
@observer
class StateDispatchDialog extends Component {
  handleChange = e => {
    const { session } = this.props
    session.ui.actionToDispatch = e.target.value
  }

  onAfterOpenModal = () => this.field.focus()

  render() {
    const { ui } = this.props.session

    return (
      <Modal
        isOpen={ui.showStateDispatchDialog}
        onRequestClose={ui.closeStateDispatchDialog}
        onAfterOpen={this.onAfterOpenModal}
        style={{
          content: AppStyles.Modal.content,
          overlay: AppStyles.Modal.overlay,
        }}
      >
        <div style={AppStyles.Modal.container}>
          <div style={AppStyles.Modal.header}>
            <h1 style={AppStyles.Modal.title}>{DIALOG_TITLE}</h1>
            <p style={AppStyles.Modal.subtitle}>{INSTRUCTIONS}</p>
          </div>
          <div style={AppStyles.Modal.body}>
            <label style={AppStyles.Modal.fieldLabel}>{FIELD_LABEL}</label>
            <textarea
              placeholder={INPUT_PLACEHOLDER}
              style={Styles.dispatchField}
              type="text"
              ref={node => (this.field = node)}
              value={ui.actionToDispatch}
              onKeyPress={this.handleKeyPress}
              onChange={this.handleChange}
            />
          </div>
          <div style={AppStyles.Modal.keystrokes}>
            <div style={AppStyles.Modal.hotkey} onClick={ui.closeStateDispatchDialog}>
              <span style={AppStyles.Modal.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
            </div>
            <div style={AppStyles.Modal.hotkey} onClick={ui.submitCurrentFormDelicately}>
              <span style={AppStyles.Modal.keystroke}>{ENTER_KEYSTROKE}</span> {ENTER_HINT}
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default StateDispatchDialog
