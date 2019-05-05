import React from 'react'
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

const SidebarButton = props => {
  const { icon: Icon, iconSize, isActive, onClick, hideTopBorder, children } = props
  const containerStyles = mergeAll([
    Styles.container,
    isActive ? Styles.containerActive : {},
    hideTopBorder ? Styles.containerTop : {}
  ])

  return (
    <div style={containerStyles} onClick={onClick}>
      { Icon && <Icon size={iconSize || Styles.iconSize} /> }
      { children }
      <div style={Styles.text}>{props.text}</div>
    </div>
  )
}

SidebarButton.propTypes = {
  icon: PropTypes.any,
  iconSize: PropTypes.number,
  text: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  hideTopBorder: PropTypes.bool
}

export default SidebarButton
