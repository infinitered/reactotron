import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import SideMenu from './SideMenu'
import LogList from './LogList'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.screen,
    position: 'relative'
  },
  topShadow: {
    height: 5,
    WebkitBoxShadow: `inset 0px 2px 4px 0px ${Colors.subtleShadow}`
  },
  bottomShadow: {
    height: 5,
    WebkitBoxShadow: `inset 0px -2px 4px 0px ${Colors.subtleShadow}`
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
class Body extends Component {

  render () {
    const { server } = this.props.session
    const logs = server.commands['log']
    return (
      <div style={Styles.container}>
        <div style={Styles.topShadow}></div>
        <SideMenu />
        <div style={Styles.content} id={'body'}>
          <LogList logs={logs} />
        </div>
        <div style={Styles.bottomShadow}></div>
      </div>
    )
  }

}

export default Body
