import React, { Component } from "react"
import Modal from "react-modal"
import { inject, observer } from "mobx-react"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"

const INPUT_PLACEHOLDER = "smurfs.7.name"
const ESCAPE_KEYSTROKE = "Esc"
const ESCAPE_HINT = "OMG Cancel"
const ENTER_KEYSTROKE = "Enter"
const ENTER_HINT = "Search"
const TAB_KEYSTROKE = "Tab"
const TAB_HINT = "Keys/Values"
const DIALOG_TITLE_KEYS = "State Keys"
const DIALOG_TITLE_VALUES = "State Values"
const STATE_VALUES_INSTRUCTIONS = (
  <span>
    Retrieves a value from the state tree at the given path
    <span style={{ color: Colors.bold }}>and all values below it</span>.
  </span>
)
const STATE_KEYS_INSTRUCTIONS = (
  <span>Retrieves a list of keys located at the given path in the state tree.</span>
)
const FIELD_LABEL = "Path"

@inject("session")
@observer
class StateKeysAndValuesDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: null,
    }
  }

  handleChange = e => {
    this.setState({ path: e.target.value })
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.submit()
    }
  }

  onAfterOpenModal = () => this.field.focus()

  submit = () => {
    const { ui } = this.props.session
    const { path } = this.state

    this.setState({ path: null })
    ui.getStateKeysOrValues(path)
    ui.closeStateFindDialog()
  }

  render() {
    const { ui } = this.props.session
    const { showStateFindDialog, closeStateFindDialog, toggleKeysValues } = ui
    const isKeys = ui.keysOrValues === "keys"

    return (
      <Modal
        isOpen={showStateFindDialog}
        onRequestClose={closeStateFindDialog}
        onAfterOpen={this.onAfterOpenModal}
        style={{
          content: AppStyles.Modal.content,
          overlay: AppStyles.Modal.overlay,
        }}
      >
        <div style={AppStyles.Modal.container}>
          <div style={AppStyles.Modal.header}>
            <h1 style={AppStyles.Modal.title}>
              {isKeys ? DIALOG_TITLE_KEYS : DIALOG_TITLE_VALUES}
            </h1>
            <p style={AppStyles.Modal.subtitle}>
              {isKeys ? STATE_KEYS_INSTRUCTIONS : STATE_VALUES_INSTRUCTIONS}
            </p>
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
            <div style={AppStyles.Modal.hotkey} onClick={closeStateFindDialog}>
              <span style={AppStyles.Modal.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
            </div>
            <div style={AppStyles.Modal.hotkey} onClick={toggleKeysValues}>
              <span style={AppStyles.Modal.keystroke}>{TAB_KEYSTROKE}</span> {TAB_HINT}
            </div>
            <div style={AppStyles.Modal.hotkey} onClick={this.submit}>
              <span style={AppStyles.Modal.keystroke}>{ENTER_KEYSTROKE}</span> {ENTER_HINT}
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default StateKeysAndValuesDialog
