import React, { Component, PropTypes } from 'react'
import Colors from '../Theme/Colors'
import ReactTooltip from 'react-tooltip'

const Styles = {
  container: {
    color: Colors.highlight,
    marginTop: -2,
    marginRight: 8
  },
  iconSize: 24,
  icon: {
  }
}

class CommandToolbarButton extends Component {
  static propTypes = {
    tip: PropTypes.string,
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { tip, icon, onClick } = this.props
    const Icon = require(`react-icons/lib/md/${icon}`)
    return (
      <div data-tip={tip} onClick={onClick} style={Styles.container}>
        <Icon size={Styles.iconSize} style={Styles.icon} />
        <ReactTooltip place='bottom' className='tooltipTheme' />
      </div>
    )
  }
}

export default CommandToolbarButton
