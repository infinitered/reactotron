import React, { Component, PropTypes } from 'react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import { merge } from 'ramda'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: Colors.highlight,
    cursor: 'pointer'
  },
  containerActive: {
    color: Colors.foregroundLight
  },
  iconSize: 32
}

class SidebarButton extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { icon, isActive, onClick } = this.props
    const Icon = require(`react-icons/lib/md/${icon}`)
    const containerStyles = merge(Styles.container, isActive ? Styles.containerActive : {})

    return (
      <div style={containerStyles} onClick={onClick}>
        <Icon size={Styles.iconSize} />
      </div>
    )
  }
}

export default SidebarButton
