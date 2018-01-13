import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import { inject, observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'

const INPUT_PLACEHOLDER = 'smurfs.7.name'
const ESCAPE_KEYSTROKE = 'Esc'
const ESCAPE_HINT = 'OMG Cancel'
const ENTER_KEYSTROKE = 'Enter'
const ENTER_HINT = 'Search'
const TAB_KEYSTROKE = 'Tab'
const TAB_HINT = 'Keys/Values'
const DIALOG_TITLE_KEYS = 'State Keys'
const DIALOG_TITLE_VALUES = 'State Values'
const STATE_VALUES_INSTRUCTIONS = (
  <span>
    Retrieves a value from the state tree at the given path{' '}
    <span style={{ color: Colors.bold }}>and all values below it</span>.
  </span>
)
const STATE_KEYS_INSTRUCTIONS = (
  <span>Retrieves a list of keys located at the given path in the state tree.</span>
)
const FIELD_LABEL = 'Path'

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

@inject('session')
@observer
class StateKeysAndValuesDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {
      path: null
    }
  }

  handleChange = e => {
    this.setState({ path: e.target.value })
  }

  handleKeyPress = e => {
    const { ui } = this.props.session
    const { path } = this.state
    if (e.key === 'Enter') {
      this.setState({ path: null })
      ui.getStateKeysOrValues(path)
      ui.closeStateFindDialog()
    }
  }

  componentDidUpdate () {
    const field = ReactDOM.findDOMNode(this.field)

    field && field.focus()
  }

  render () {
    const { ui } = this.props.session
    const open = ui.showStateFindDialog
    const isKeys = ui.keysOrValues === 'keys'
    if (!open) return null

    return (
      <Modal
        isOpen
        onRequestClose={ui.closeStateFindDialog}
        style={{ content: Styles.dialog, overlay: { zIndex: 5 } }}
      >
        <div style={Styles.container}>
          <div style={Styles.header}>
            <h1 style={Styles.title}>{isKeys ? DIALOG_TITLE_KEYS : DIALOG_TITLE_VALUES}</h1>
            <p style={Styles.subtitle}>
              {isKeys ? STATE_KEYS_INSTRUCTIONS : STATE_VALUES_INSTRUCTIONS}
            </p>
          </div>
          <div style={Styles.body}>
            <label style={Styles.fieldLabel}>{FIELD_LABEL}</label>
            <input
              placeholder={INPUT_PLACEHOLDER}
              style={Styles.textField}
              type='text'
              ref={node => (this.field = node)}
              onKeyPress={this.handleKeyPress}
              onChange={this.handleChange}
            />
          </div>
          <div style={Styles.keystrokes}>
            <div style={Styles.hotkey}>
              <span style={Styles.keystroke}>{ESCAPE_KEYSTROKE}</span> {ESCAPE_HINT}
            </div>
            <div style={Styles.hotkey}>
              <span style={Styles.keystroke}>{TAB_KEYSTROKE}</span> {TAB_HINT}
            </div>
            <div style={Styles.hotkey}>
              <span style={Styles.keystroke}>{ENTER_KEYSTROKE}</span> {ENTER_HINT}
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default StateKeysAndValuesDialog
