import React, { Component } from 'react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import SidebarButton from './SidebarButton'
import { inject, observer } from 'mobx-react'

const Styles = {
  container: {
    zIndex: 5,
    width: 80,
    backgroundColor: Colors.backgroundSubtleDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`,
    borderRight: `1px solid ${Colors.chromeLine}`,
    WebkitAppRegion: 'drag'
  },
  content: {
    ...AppStyles.Layout.vbox,
    height: '100vh',
    alignItems: 'center'
  },
  tabs: {
    paddingTop: 20
  },
  spacer: {
    flex: 1
  }
}

@inject('session')
@observer
class Sidebar extends Component {

  constructor (props) {
    super(props)
    this.handleClickTimeline = () => { this.props.session.ui.switchTab('timeline') }
    this.handleClickSubscriptions = () => { this.props.session.ui.switchTab('subscriptions') }
    this.handleClickHelp = () => { this.props.session.ui.switchTab('help') }
    this.handleClickSettings = () => { this.props.session.ui.switchTab('settings') }
  }

  render () {
    const { session } = this.props
    const { ui } = session

    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.tabs}>
            <SidebarButton text='Timeline' icon='reorder' isActive={ui.tab === 'timeline'} onClick={this.handleClickTimeline} />
            <SidebarButton text='Subs' icon='notifications-none' isActive={ui.tab === 'subscriptions'} onClick={this.handleClickSubscriptions} />
          </div>
          <div style={Styles.spacer} />
          <div>
            <SidebarButton text='Help' icon='live-help' isActive={ui.tab === 'help'} onClick={this.handleClickHelp} />
          </div>
        </div>
      </div>
    )
  }

}

export default Sidebar
