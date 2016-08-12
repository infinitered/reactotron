import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ModalPortal, ModalBackground, ModalDialog } from 'react-modal-dialog'
import { inject, observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'

const Styles = {
  dialog: {
    borderRadius: 4,
    padding: 4,
    width: 400,
    backgroundColor: Colors.screen
  },
  container: {
    ...AppStyles.Layout.vbox,
  },
  keystrokes: {
    ...AppStyles.Layout.hbox,
    alignSelf: 'center',
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 20,
    color: Colors.mutedText
  },
  hotkey: {
    padding: '0 10px'
  },
  keystroke: {
    backgroundColor: Colors.text,
    color: Colors.textInverse,
    padding: '4px 8px',
    borderRadius: 4
  },
  header: {
    ...AppStyles.Layout.vbox,
    padding: '1em 2em 1em',
    backgroundColor: Colors.screen
  },
  body: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.screen,
    padding: '2em 2em 4em'
  },
  title: {
    margin: 0,
    padding: 0,
    textAlign: 'left',
    fontWeight: 'normal',
    fontSize: 40,
    color: Colors.text
  },
  subtitle: {
    color: Colors.primary,
    textAlign: 'left',
    fontSize: 16,
    padding: 0,
    margin: 0
  },
  fieldLabel: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  textField: {
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: `1px solid ${Colors.line}`,
    fontSize: 23,
    lineHeight: '40px',
    color: Colors.Text,
    backgroundColor: 'inherit'
  },

  '&focus': {
    border: 0
  },
  instructions: {
    textAlign: 'center'
  }
}

@inject('session')
@observer
class SampleModal extends Component {

  constructor (props) {
    super(props)
    this.state = {
      path: null
    }
  }

  handleChange = (e) => {
    this.setState({ path: e.target.value })
  }

  handleKeyPress = (e) => {
    const { ui } = this.props.session
    const { path } = this.state
    if (e.key === 'Enter') {
      this.setState({path: null})
      ui.getStateValues(path)
      ui.closeStateFindDialog()
    }
  }

  render () {
    const { ui } = this.props.session
    const open = ui.showStateFindDialog
    if (!open) return null

    // need to find a less hacky way of doing this
    setTimeout(() => ReactDOM.findDOMNode(this.refs.textField).focus(), 1)
    return (
      <ModalPortal>
        <ModalBackground onClose={ui.closeStateFindDialog}>
          <ModalDialog style={Styles.dialog}>
            <div style={Styles.container}>
              <div style={Styles.header}>
                <h1 style={Styles.title}>State</h1>
                <p style={Styles.subtitle}>
                  Retrieves a value from the state tree at the given
                  path <strong>and all values below</strong>.
                </p>
              </div>
              <div style={Styles.body}>
                <label style={Styles.fieldLabel}>Path</label>
                <input
                  placeholder='smurfs.7.name'
                  style={Styles.textField}
                  type='text'
                  ref='textField'
                  onKeyPress={this.handleKeyPress}
                  onChange={this.handleChange}
                />
              </div>
              <div style={Styles.keystrokes}>
                <div style={Styles.hotkey}>
                  <span style={Styles.keystroke}>Esc</span> OMG Cancel
                </div>
                <div style={Styles.hotkey}>
                  <span style={Styles.keystroke}>Enter</span> Search
                </div>
              </div>
            </div>
          </ModalDialog>
        </ModalBackground>
      </ModalPortal>
    )
  }
}

export default SampleModal
