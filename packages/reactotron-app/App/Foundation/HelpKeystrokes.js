import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import Key from '../Shared/Key'
import Keystroke from '../Lib/Keystroke'

const Styles = {
  container: {
    color: Colors.foreground
  },
  helpLabel: {
    width: 160
  },
  key: {
    color: Colors.foregroundLight,
    textTransform: 'uppercase',
    borderRadius: 4,
    backgroundColor: Colors.foreground,
    padding: '4px 8px',
    fontWeight: 'bold',
    borderBottom: `2px solid ${Colors.highlight}`
  },
  helpDetail: {
    color: Colors.foreground
  },
  group: {
    ...AppStyles.Layout.vbox,
    marginTop: 0,
    marginBottom: 30,
    color: Colors.highlight
  },
  category: {
    color: Colors.highlight
  },
  helpShortcut: {
    ...AppStyles.Layout.hbox,
    padding: '10px 0px'
  },
  both: {
  }
}

class HelpKeystrokes extends Component {
  render () {
    return (
      <div style={Styles.container}>

        <div style={Styles.both}>

          <div style={Styles.group}>
            <div style={Styles.category}>Navigation</div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text={Keystroke.modifierName} />+<Key text='1' /></div>
              <div style={Styles.helpDetail}>view timeline</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text={Keystroke.modifierName} />+<Key text='2' /></div>
              <div style={Styles.helpDetail}>view subscriptions</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text={Keystroke.modifierName} />+<Key text='3' /></div>
              <div style={Styles.helpDetail}>view state snapshots</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text={Keystroke.modifierName} />+<Key text='4' /></div>
              <div style={Styles.helpDetail}>view React Native tools</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text={Keystroke.modifierName} />+<Key text='/' /></div>
              <div style={Styles.helpDetail}>view help</div>
            </div>
          </div>

          <div style={Styles.group}>
            <div style={Styles.category}>State Goodies</div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text={Keystroke.modifierName} />+<Key text='F' /></div>
              <div style={Styles.helpDetail}>find keys or values</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text={Keystroke.modifierName} />+<Key text='⬆' />+<Key text='F' /></div>
              <div style={Styles.helpDetail}>filter timeline</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text={Keystroke.modifierName} />+<Key text='N' /></div>
              <div style={Styles.helpDetail}>new subscription</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text={Keystroke.modifierName} />+<Key text='D' /></div>
              <div style={Styles.helpDetail}>dispatch an action</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text={Keystroke.modifierName} />+<Key text='S' /></div>
              <div style={Styles.helpDetail}>take a snapshot of current state</div>
            </div>
          </div>

          <div style={Styles.group}>
            <div style={Styles.category}>Miscellaneous</div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text={Keystroke.modifierName} />+<Key text='K' /></div>
              <div style={Styles.helpDetail}>klear!</div>
            </div>
          </div>

        </div>

      </div>
    )
  }
}

export default HelpKeystrokes
