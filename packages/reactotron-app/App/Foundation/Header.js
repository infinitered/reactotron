import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import Tab from './Tab'
import AppStyles from '../Theme/AppStyles'
import { inject } from 'mobx-react'

const Styles = {
  container: {
    WebkitAppRegion: 'drag'
  },
  content: {
    backgroundColor: Colors.toolbar,
    height: 60
  },
  tabs: {
    ...AppStyles.Layout.hbox,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
    fontSize: 18
  }
}

@inject('session')
class Header extends Component {

  render () {
    const { ui } = this.props.session
    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.tabs}>
            <Tab tabId='streaming' text='STREAMING' onPress={ui.switchTabToStreaming} />
            <Tab tabId='logging' text='LOGGING' onPress={ui.switchTabToLogging} />
            <Tab tabId='state' text='STATE' onPress={ui.switchTabToState} />
            <Tab tabId='network' text='NETWORK' onPress={ui.switchTabToNetwork} />
          </div>
        </div>
      </div>
    )
  }

}

export default Header
