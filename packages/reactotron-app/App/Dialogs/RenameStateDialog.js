import React from "react"
import Modal from "react-modal"
import { inject, observer } from "mobx-react"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"

const ESCAPE_KEYSTROKE = "Esc"
const ESCAPE_HINT = "Cancel"
const ENTER_KEYSTROKE = `Enter`
const ENTER_HINT = "Save"
const DIALOG_TITLE = "Save State Snapshot"
const INPUT_PLACEHOLDER = ""
const FIELD_LABEL = "Name"

@inject("session")
@observer
class RenameStateDialog extends React.Component {
  onAfterOpenModal = () => {
    this.field.focus()
    this.field.select()
  }

  render() {
    const { ui } = this.props.session

    return (
      <Modal
        isOpen={ui.showRenameStateDialog}
        onRequestClose={ui.closeRenameStateDialog}
        onAfterOpen={this.onAfterOpenModal}
        style={{
          content: AppStyles.Modal.content,
          overlay: AppStyles.Modal.overlay,
        }}
      >
        <div style={AppStyles.Modal.container}>
          <div style={AppStyles.Modal.header}>
            <h1 style={AppStyles.Modal.title}>{DIALOG_TITLE}</h1>
          </div>
          <div style={AppStyles.Modal.body}>
            <label style={AppStyles.Modal.fieldLabel}>{FIELD_LABEL}</label>
            <input
              autoFocus
              placeholder={INPUT_PLACEHOLDER}
              style={AppStyles.Modal.textField}
              type="text"
              ref={node => (this.field = node)}
              defaultValue={ui.backupStateName}
              onChange={e => (ui.backupStateName = e.target.value)}
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

export default RenameStateDialog
