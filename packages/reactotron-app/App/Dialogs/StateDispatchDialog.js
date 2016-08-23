import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ModalPortal, ModalBackground, ModalDialog } from 'react-modal-dialog'
import { inject, observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'

const ESCAPE_KEYSTROKE = 'Esc'
const ESCAPE_HINT = 'Cancel'
const ENTER_KEYSTROKE = '⌘ + Enter'
const ENTER_HINT = 'Dispatch'
const DIALOG_TITLE = 'Dispatch Action'
const INSTRUCTIONS = (
  <span> Create an action that will be dispatched to the client to run.</span>
)
const INPUT_PLACEHOLDER = '{ type: \'RepoMessage.Request\' }'
const FIELD_LABEL = 'Action'

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
  dispatchField: {
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: `1px solid ${Colors.line}`,
    fontSize: 23,
    color: Colors.foregroundLight,
    backgroundColor: 'inherit',
    height: 200
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
    const open = ui.showStateDispatchDialog
    if (!open) return null

    // need to find a less hacky way of doing this
    setTimeout(() => ReactDOM.findDOMNode(this.refs.dispatchField).focus(), 1)
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
                <label style={Styles.fieldLabel}>{FIELD_LABEL}</label>
                <textarea
                  placeholder={INPUT_PLACEHOLDER}
                  style={Styles.dispatchField}
                  type='text'
                  ref='dispatchField'
                  value={ui.actionToDispatch}
                  onKeyPress={this.handleKeyPress}
                  onChange={this.handleChange}
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
          </ModalDialog>
        </ModalBackground>
      </ModalPortal>
    )
  }
}

export default StateDispatchDialog
