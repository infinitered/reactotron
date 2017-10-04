import React from 'react'
import { ModalPortal, ModalBackground, ModalDialog } from 'react-modal-dialog'
import { inject, observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import Keystroke from '../Lib/Keystroke'

const ESCAPE_KEYSTROKE = 'Esc'
const ESCAPE_HINT = 'Close'
const DIALOG_TITLE = 'Reactotron Quick-Help'
const INSTRUCTIONS = (
  <span> Shortcut list</span>
)

const Styles = {
  dialog: {
    borderRadius: 4,
    padding: 4,
    width: 450,
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
    paddingBottom: 20
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
    padding: '0.5em 2em 3em'
  },
  helpShortcut: {
    ...AppStyles.Layout.hbox,
    margin: '2px 0'
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
  helpLabel: {
    // borderBottom: `1px solid ${Colors.line}`,
    color: Colors.bold,
    textTransform: 'uppercase',
    width: 100
  },
  helpDetail: {
    flex: 1
  },
  group: {
    marginTop: 10,
    marginBottom: 2,
    paddingBottom: 2,
    color: Colors.highlight,
    borderBottom: `1px solid ${Colors.line}`
  }
}

const StateDispatchDialog = inject('session')(observer(({ session }) => {
  if (!session.ui.showHelpDialog) return null

  return (
    <ModalPortal>
      <ModalBackground onClose={session.ui.closeHelpDialog}>
        <ModalDialog style={Styles.dialog}>
          <div style={Styles.container}>
            <div style={Styles.header}>
              <h1 style={Styles.title}>{DIALOG_TITLE}</h1>
              <p style={Styles.subtitle}>
                {INSTRUCTIONS}
              </p>
            </div>
            <div style={Styles.body}>
              <div style={Styles.group}>Working With State</div>
              <div style={Styles.helpShortcut}>
                <div style={Styles.helpLabel}>{Keystroke.modifierName} + F</div>
                <div style={Styles.helpDetail}>find keys or values</div>
              </div>
              <div style={Styles.helpShortcut}>
                <div style={Styles.helpLabel}>{Keystroke.modifierName} + N</div>
                <div style={Styles.helpDetail}>new subscription</div>
              </div>
              <div style={Styles.helpShortcut}>
                <div style={Styles.helpLabel}>{Keystroke.modifierName} + D</div>
                <div style={Styles.helpDetail}>dispatch an action</div>
              </div>
              <div style={Styles.group}>Miscellaneous</div>
              <div style={Styles.helpShortcut}>
                <div style={Styles.helpLabel}>{Keystroke.modifierName} + K</div>
                <div style={Styles.helpDetail}>klear!</div>
              </div>
              <div style={Styles.helpShortcut}>
                <div style={Styles.helpLabel}>{Keystroke.modifierName} + /</div>
                <div style={Styles.helpDetail}>toggle help</div>
              </div>
            </div>
            <div style={Styles.keystrokes}>
              <div style={Styles.hotkey}>
                <span style={Styles.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
              </div>
            </div>
          </div>
        </ModalDialog>
      </ModalBackground>
    </ModalPortal>
  )
}))

export default StateDispatchDialog
