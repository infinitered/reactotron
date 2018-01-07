import React from 'react'
import Modal from 'react-modal'
import { inject, observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'

const ESCAPE_KEYSTROKE = 'Esc'
const ESCAPE_HINT = 'Cancel'
const ENTER_KEYSTROKE = `Enter`
const ENTER_HINT = 'Rename'
const DIALOG_TITLE = 'Rename State Snapshot'
const INPUT_PLACEHOLDER = ''
const FIELD_LABEL = 'New Name'

const Styles = {
  dialog: {
    borderRadius: 4,
    padding: 4,
    backgroundColor: Colors.background,
    color: Colors.foreground
  },
  container: {
    ...AppStyles.Layout.vbox
  },
  keystrokes: {
    ...AppStyles.Layout.hbox,
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    fontSize: 13
  },
  hotkey: {
    padding: '0 10px'
  },
  keystroke: {
    backgroundColor: Colors.backgroundHighlight,
    color: Colors.foreground,
    padding: '4px 8px',
    borderRadius: 4
  },
  header: {
    ...AppStyles.Layout.vbox,
    padding: '2em 2em 1em'
  },
  body: {
    ...AppStyles.Layout.vbox,
    padding: '2em 2em 4em'
  },
  title: {
    margin: 0,
    padding: 0,
    textAlign: 'left',
    fontWeight: 'normal',
    fontSize: 24,
    color: Colors.heading
  },
  subtitle: {
    color: Colors.foreground,
    textAlign: 'left',
    padding: 0,
    margin: 0
  },
  fieldLabel: {
    color: Colors.heading,
    fontSize: 13,
    textTransform: 'uppercase'
  },
  textField: {
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: `1px solid ${Colors.line}`,
    fontSize: 23,
    color: Colors.foregroundLight,
    lineHeight: '40px',
    backgroundColor: 'inherit'
  }
}

const RenameStateDialog = inject('session')(
  observer(({ session }) => {
    const { ui } = session
    if (!ui.showRenameStateDialog) return null

    return (
      <Modal
        isOpen
        onRequestClose={ui.closeRenameStateDialog}
        style={{ content: Styles.dialog, overlay: { zIndex: 5 } }}
      >

        <div style={Styles.container}>
          <div style={Styles.header}>
            <h1 style={Styles.title}>{DIALOG_TITLE}</h1>
          </div>
          <div style={Styles.body}>
            <label style={Styles.fieldLabel}>{FIELD_LABEL}</label>
            <input
              autoFocus
              placeholder={INPUT_PLACEHOLDER}
              style={Styles.textField}
              type='text'
              ref='textField'
              defaultValue={ui.backupStateName}
              onChange={e => (ui.backupStateName = e.target.value)}
            />
          </div>
          <div style={Styles.keystrokes}>
            <div style={Styles.hotkey}>
              <span style={Styles.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
            </div>
            <div style={Styles.hotkey}>
              <span style={Styles.keystroke}>{ENTER_KEYSTROKE}</span> {ENTER_HINT}
            </div>
          </div>
        </div>
      </Modal>
    )
  })
)

export default RenameStateDialog
