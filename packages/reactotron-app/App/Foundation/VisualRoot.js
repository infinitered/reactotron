import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import Timeline from './Timeline'
import StateKeysAndValuesDialog from '../Dialogs/StateKeysAndValuesDialog'
import StateDispatchDialog from '../Dialogs/StateDispatchDialog'
import StateWatchDialog from '../Dialogs/StateWatchDialog'
import RenameStateDialog from '../Dialogs/RenameStateDialog'
import FilterTimelineDialog from '../Dialogs/FilterTimelineDialog'
import SendCustomDialog from '../Dialogs/SendCustomDialog'
import ConnectionSelectionDialog from '../Dialogs/ConnectionSelectionDialog'
import Subscriptions from './Subscriptions'
import Backups from './Backups'
import Native from './Native'
import Stats from './Stats'
import Sidebar from './Sidebar'
import Help from './Help'
import { inject, observer } from 'mobx-react'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox
  },
  content: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.background,
    color: Colors.foreground,
    height: '100vh',
    scroll: 'hidden'
  },
  body: {
    ...AppStyles.Layout.hbox
  },
  app: {
    ...AppStyles.Layout.vbox,
    scroll: 'none',
    overflow: 'hidden'
  },
  page: {
    ...AppStyles.Layout.vbox
  },
  pageHidden: {
    flex: 0,
    height: 0,
    visibility: 'hidden'
  }
}

@inject('session')
@observer
export default class VisualRoot extends Component {
  render () {
    const { session } = this.props
    const { ui } = session
    const showTimeline = ui.tab === 'timeline'
    const showSubscriptions = ui.tab === 'subscriptions'
    const showHelp = ui.tab === 'help'
    const showSettings = ui.tab === 'settings'
    const showBackups = ui.tab === 'backups'
    const showNative = ui.tab === 'native'
    const showStats = ui.tab === 'stats'

    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.body}>
            <Sidebar />
            <div style={Styles.app}>
              <div style={showTimeline ? Styles.page : Styles.pageHidden}>
                <Timeline />
              </div>
              <div style={showSubscriptions ? Styles.page : Styles.pageHidden}>
                <Subscriptions />
              </div>
              <div style={showBackups ? Styles.page : Styles.pageHidden}>
                <Backups />
              </div>
              <div style={showHelp ? Styles.page : Styles.pageHidden}>
                <Help />
              </div>
              <div style={showNative ? Styles.page : Styles.pageHidden}>
                <Native />
              </div>
              <div style={showStats ? Styles.page : Styles.pageHidden}>
                <Stats />
              </div>
              <div style={showSettings ? Styles.page : Styles.pageHidden}>
                <h1>Settings</h1>
              </div>
            </div>
          </div>
        </div>
        <StateKeysAndValuesDialog />
        <StateDispatchDialog />
        <StateWatchDialog />
        <RenameStateDialog />
        <FilterTimelineDialog />
        <SendCustomDialog />
        <ConnectionSelectionDialog />
      </div>
    )
  }
}
