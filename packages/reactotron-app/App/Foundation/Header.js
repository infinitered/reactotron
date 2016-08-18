import React, { Component } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import HelpIcon from 'react-icons/lib/md/help'
import ReactTooltip from 'react-tooltip'
import { inject, observer } from 'mobx-react'

const Styles = {
  container: {
    WebkitAppRegion: 'drag'
  },
  content: {
    padding: '10px 10px',
    backgroundColor: Colors.chrome,
    borderBottom: `1px solid ${Colors.chromeLine}`,
    color: Colors.foregroundDark,
    boxShadow: `0px 0px 30px ${Colors.glow}`
  },
  toolbar: {
    ...AppStyles.Layout.hbox,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  tooltip: {
    backgroundColor: Colors.backgroundLight,
    padding: 10
  }
}

@inject('session')
@observer
class Header extends Component {

  render () {
    const { ui } = this.props.session
    return (
      <div style={Styles.container}>
        <div style={Styles.content}>
          <div style={Styles.toolbar}>
            <HelpIcon size={30} data-tip onClick={ui.openHelpDialog} />
          </div>
        </div>
        <ReactTooltip place='left' className='tooltipTheme'>
          <p>Need Some Help?</p>
        </ReactTooltip>
      </div>
    )
  }

}

export default Header
