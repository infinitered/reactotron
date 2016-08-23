import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import Key from '../Shared/Key'

const Styles = {
  container: {
    color: Colors.foreground
  },
  helpLabel: {
    width: 120
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
              <div style={Styles.helpLabel}><Key text='⌘' />+<Key text='1' /></div>
              <div style={Styles.helpDetail}>view timeline</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text='⌘' />+<Key text='2' /></div>
              <div style={Styles.helpDetail}>view subscriptions</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text='⌘' />+<Key text='/' /></div>
              <div style={Styles.helpDetail}>view help</div>
            </div>
          </div>

          <div style={Styles.group}>
            <div style={Styles.category}>State Goodies</div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text='⌘' />+<Key text='F' /></div>
              <div style={Styles.helpDetail}>find keys or values</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text='⌘' />+<Key text='N' /></div>
              <div style={Styles.helpDetail}>new subscription</div>
            </div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text='⌘' />+<Key text='D' /></div>
              <div style={Styles.helpDetail}>dispatch an action</div>
            </div>
          </div>

          <div style={Styles.group}>
            <div style={Styles.category}>Miscellaneous</div>
            <div style={Styles.helpShortcut}>
              <div style={Styles.helpLabel}><Key text='⌘' />+<Key text='K' /></div>
              <div style={Styles.helpDetail}>klear!</div>
            </div>
          </div>

        </div>

      </div>
    )
  }
}

export default HelpKeystrokes
