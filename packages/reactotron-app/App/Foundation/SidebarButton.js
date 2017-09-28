import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import { mergeAll } from 'ramda'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    alignItems: 'center',
    paddingTop: 15,
    marginBottom: 15,
    color: Colors.highlight,
    cursor: 'pointer',
    borderTop: `1px solid ${Colors.line}`,
    marginLeft: 10,
    marginRight: 10
  },
  containerTop: {
    borderTop: 0
  },
  containerActive: {
    color: Colors.foregroundLight
  },
  iconSize: 32,
  text: {
    paddingTop: 2,
    textAlign: 'center',
    fontSize: 12
  }
}

class SidebarButton extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    hideTopBorder: PropTypes.bool
  }

  render () {
    const { icon, isActive, onClick, hideTopBorder } = this.props
    const Icon = require(`react-icons/lib/md/${icon}`)
    const containerStyles = mergeAll([
      Styles.container,
      isActive ? Styles.containerActive : {},
      hideTopBorder ? Styles.containerTop : {}
    ])

    return (
      <div style={containerStyles} onClick={onClick}>
        <Icon size={Styles.iconSize} />
        <div style={Styles.text}>{this.props.text}</div>
      </div>
    )
  }
}

export default SidebarButton
