import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import HelpHeader from './HelpHeader'
import HelpKeystrokes from './HelpKeystrokes'
import HelpFeedback from './HelpFeedback'

const FEEDBACK = 'Let\'s Connect!'
const KEYSTROKES = 'Keystrokes'

const logoUrl = require('../Theme/Reactotron-128.png')

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1
  },
  content: {
    padding: 20,
    overflowY: 'scroll',
    overflowX: 'hidden',
    ...AppStyles.Layout.vbox
  },
  logoPanel: {
    alignSelf: 'center'
  },
  logo: {
    alignSelf: 'center',
    height: 128,
    marginTop: 20,
    marginBottom: 20
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    color: Colors.foregroundLight,
    paddingBottom: 2,
    borderBottom: `1px solid ${Colors.highlight}`
  }
}

class Help extends Component {

  render () {
    return (
      <div style={Styles.container}>
        <HelpHeader />
        <div style={Styles.content}>
          <div style={Styles.logoPanel}>
            <img src={logoUrl} style={Styles.logo} />
          </div>

          <div style={Styles.title}>{FEEDBACK}</div>
          <HelpFeedback />

          <div style={Styles.title}>{KEYSTROKES}</div>
          <HelpKeystrokes />

        </div>
      </div>
    )
  }
}

export default Help
