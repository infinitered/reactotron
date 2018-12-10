import React from "react"
import Modal from "react-modal"
import { inject, observer } from "mobx-react"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import Checkbox from "../Shared/Checkbox"
import Keystroke from "../Lib/Keystroke"

import { remote } from 'electron'


const FIELD_LABEL = "File path"
const INPUT_PLACEHOLDER = "e.g. /Documents/timeline.log"

const ESCAPE_HINT = "Close"
const ESCAPE_KEYSTROKE = "ESC"
const ENTER_KEYSTROKE = `${Keystroke.modifierName} + Enter`
const ENTER_HINT = "Save File"
const BUTTON_TEXT = "Choose Path"
const DIALOG_TITLE = "Export Timeline"

const Styles = {
  error: {
    color: Colors.tag,
    padding: "1em 2em 0em"
  },
  success: {
    color: Colors.string,
    padding: "1em 2em 0em"
  },
  link: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20,
    cursor: 'pointer',
    backgroundColor: Colors.chrome,
    borderRadius: 8,
    width: 110,
    border: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundLight
  },
  path: {
    marginLeft: 20,
    color: Colors.foregroundLight,
    alignSelf: "center",
    fontSize: "9pt"
  },
  body: {
    ...AppStyles.Modal.body,
    flexDirection: "row",
    padding: "1em 2em 1em"
  },
  keyStrokes: {
    ...AppStyles.Modal.keystrokes,
    marginTop: 40
  }
}

@inject("session")
@observer
class ExportTimelineDialog extends React.Component {
  constructor(props) {
    super()
    const { session } = props
    const { ui } = session
    ui.writingFileError = ""
    ui.writingFileSuccess = false
    this.path = ""
  }

  render() {
    const { session } = this.props
    const { ui } = session

    return (
      <Modal
        isOpen={ui.showTimelineExportDialog}
        onRequestClose={ui.closeExportTimelineDialog}
        onAfterOpen={this.onAfterOpenModal}
        style={{
          content: AppStyles.Modal.content,
          overlay: AppStyles.Modal.overlay,
        }}
      >
        <div style={AppStyles.Modal.container}>
          <div style={AppStyles.Modal.header}>

            <h1 style={AppStyles.Modal.title}>{DIALOG_TITLE}</h1>
            <div>
              <p>The filters you applied to the timeline will be applied for the export too.</p>
            </div>
          </div>
          <div style={Styles.body}>
            <button style={Styles.link} onClick={() => {
              const path = remote.dialog.showOpenDialog({properties: ['openDirectory']})
              ui.setExportFilePath(path[0]);
            }}>
              {BUTTON_TEXT}
            </button>
            <p style={Styles.path}>{ui.exportFilePath}</p>
          </div>
          { ui.writingFileError !== "" ?
            <p style={Styles.error}>The file could not be exported. {ui.writingFileError}</p>
            : null
          }
          { ui.writingFileSuccess ?
            <p style={Styles.success}>The file was exported.</p>
              : null
          }
          <div style={Styles.keyStrokes}>
            <div style={AppStyles.Modal.hotkey}>
              <span style={AppStyles.Modal.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
            </div>
            <div style={AppStyles.Modal.hotkey}  onClick={() => session.exportCommands(this.path) }>
              <span style={AppStyles.Modal.keystroke}>{ENTER_KEYSTROKE}</span> {ENTER_HINT}
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default ExportTimelineDialog
