import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import Timeline from './Timeline'
import ReactTooltip from 'react-tooltip'
import StateKeysAndValuesDialog from '../Dialogs/StateKeysAndValuesDialog'
import StateDispatchDialog from '../Dialogs/StateDispatchDialog'
import HelpDialog from '../Dialogs/HelpDialog'
import StateWatchDialog from '../Dialogs/StateWatchDialog'
import WatchPanel from './WatchPanel'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.background,
    color: Colors.foreground,
    height: '100vh',
    overflow: 'hidden'
  }
}

export default class VisualRoot extends Component {

  render () {
    return (
      <div style={Styles.container}>
        <Header />
        <Timeline />
        <WatchPanel />
        <Footer />
        <StateKeysAndValuesDialog />
        <StateDispatchDialog />
        <HelpDialog />
        <StateWatchDialog />
      </div>
    )
  }
}
