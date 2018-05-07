import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import { inject, observer } from 'mobx-react'
import SidebarToggleButton from '../Foundation/SidebarToggleButton'

const TITLE = 'Using Reactotron'

const Styles = {
  container: {
    WebkitAppRegion: 'drag',
    backgroundColor: Colors.backgroundSubtleLight,
    borderBottom: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`
  },
  content: {
    height: 60,
    paddingLeft: 10,
    paddingRight: 10,
    ...AppStyles.Layout.hbox,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  left: {
    ...AppStyles.Layout.hbox,
    width: 100,
    alignItems: 'center'
  },
  right: {
    width: 100,
    ...AppStyles.Layout.hbox,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  title: {
    color: Colors.foregroundLight,
    textAlign: 'center'
  }
}

@inject('session')
@observer
class HelpHeader extends Component {
  render () {
    const { ui } = this.props.session

    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.left}>
            <SidebarToggleButton onClick={ui.toggleSidebar} isSidebarVisible={ui.isSidebarVisible} />
          </div>
          <div style={Styles.center}>
            <div style={Styles.title}>{TITLE}</div>
          </div>
          <div style={Styles.right} />
        </div>
      </div>
    )
  }
}

export default HelpHeader
