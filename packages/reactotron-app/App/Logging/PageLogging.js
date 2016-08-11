import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import SideMenu from '../Shared/SideMenu'
import LogList from './LogList'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox
  },
  content: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.screen,
    paddingLeft: 200,
    paddingRight: 150,
    paddingTop: 0,
    paddingBottom: 0,
    overflowY: 'scroll',
    marginRight: 4
  }
}

@inject('session')
@observer
class PageLogging extends Component {

  render () {
    const { server } = this.props.session
    const logs = server.commands['log']
    return (
      <div style={Styles.container}>
        <SideMenu />
        <div style={Styles.content}>
          <LogList logs={logs} />
        </div>
      </div>
    )
  }

}

export default PageLogging
