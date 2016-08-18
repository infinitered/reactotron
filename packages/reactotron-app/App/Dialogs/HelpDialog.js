import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ModalPortal, ModalBackground, ModalDialog } from 'react-modal-dialog'
import { inject, observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'

const ESCAPE_KEYSTROKE = 'Esc'
const ESCAPE_HINT = 'Close Help'
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
    padding: '0.5em 2em 3em'
  },
  helpShortcut: {
    flexDirection: 'row'
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
    fontSize: 13,
    textTransform: 'uppercase',
    paddingRight: 10
  },
  helpDetail: {
    fontSize: 13,
    color: Colors.foregroundLight,
    backgroundColor: 'inherit'
  }
}

@inject('session')
@observer
class StateDispatchDialog extends Component {

  handleChange = (e) => {
    const { session } = this.props
    session.ui.actionToDispatch = e.target.value
  }

  render () {
    const { ui } = this.props.session
    const open = ui.showHelpDialog
    if (!open) return null

    return (
      <ModalPortal>
        <ModalBackground onClose={ui.closeStateDispatchDialog}>
          <ModalDialog style={Styles.dialog}>
            <div style={Styles.container}>
              <div style={Styles.header}>
                <h1 style={Styles.title}>{DIALOG_TITLE}</h1>
                <p style={Styles.subtitle}>
                  {INSTRUCTIONS}
                </p>
              </div>
              <div style={Styles.body}>
                <div style={Styles.helpShortcut}>
                  <label style={Styles.helpLabel}>Cmd + F</label>
                  <label style={Styles.helpDetail}>find Redux keys or values (use tab to toggle)</label>
                </div>
                <div style={Styles.helpShortcut}>
                  <label style={Styles.helpLabel}>Cmd + N</label>
                  <label style={Styles.helpDetail}>subscribe to a Redux path</label>
                </div>
                <div style={Styles.helpShortcut}>
                  <label style={Styles.helpLabel}>Cmd + D</label>
                  <label style={Styles.helpDetail}>dispatch a Redux action</label>
                </div>
                <div style={Styles.helpShortcut}>
                  <label style={Styles.helpLabel}>Cmd + K</label>
                  <label style={Styles.helpDetail}>klear!</label>
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
  }
}

export default StateDispatchDialog
