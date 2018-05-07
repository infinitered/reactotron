import React from "react"
import Modal from "react-modal"
import { inject, observer } from "mobx-react"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import Checkbox from "../Shared/Checkbox"

const ESCAPE_HINT = "Close"
const ESCAPE_KEYSTROKE = "ESC"
const DIALOG_TITLE = "Connection Selection"

const Styles = {
  button: {
    height: 30,
    padding: "0 15px",
    fontSize: 13,
    marginRight: 4,
    backgroundColor: Colors.subtleLine,
    borderRadius: 2,
    border: `1px solid ${Colors.backgroundSubtleDark}`,
    cursor: "pointer",
    color: Colors.foregroundDark,
  },
  buttonActive: {
    color: Colors.bold,
  },
}

@inject("session")
@observer
class ConnectionSelectionDialog extends React.Component {
  handleSelectedConnectionChange = connectionId => {
    const { session } = this.props
    const { ui } = session

    const selectedConnection = session.connections.find(c => c.id == connectionId) || null

    session.setSelectedConnection(selectedConnection)
    ui.closeConnectionSelectionDialog()
  }

  render() {
    const { session } = this.props
    const { connections, selectedConnection, ui } = session

    const selectedConnectionId = selectedConnection ? selectedConnection.id : -1

    const makeButtonStyle = value =>
      selectedConnectionId === value ? { ...Styles.button, ...Styles.buttonActive } : Styles.button
    const makeButtonHandler = value => () => this.handleSelectedConnectionChange(value)

    const connectionButtons = connections.map(conn => (
      <button key={conn.id} style={makeButtonStyle(conn.id)} onClick={makeButtonHandler(conn.id)}>
        {conn.id} - {conn.name}
      </button>
    ))

    return (
      <Modal
        isOpen={ui.showConnectionSelectionDialog}
        onRequestClose={ui.closeConnectionSelectionDialog}
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
            <button style={makeButtonStyle(-1)} onClick={makeButtonHandler(-1)}>
              All
            </button>
            {connectionButtons}
          </div>
          <div style={AppStyles.Modal.keystrokes}>
            <div style={AppStyles.Modal.hotkey}>
              <span style={AppStyles.Modal.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default ConnectionSelectionDialog
