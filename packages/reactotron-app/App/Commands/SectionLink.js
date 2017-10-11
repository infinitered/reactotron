import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../Theme/Colors'
import { merge } from 'ramda'

const Styles = {
  container: {
    backgroundColor: Colors.backgroundLighter,
    padding: '4px 8px',
    margin: 4,
    borderRadius: 4,
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerActive: {
    backgroundColor: Colors.constant
  },
  text: {
    color: Colors.foreground,
    textAlign: 'center'
  },
  textActive: {
    color: Colors.background
  }
}

const SectionLink = props => {
  const { isActive = false, text, onClick } = props
  const containerStyles = merge(Styles.container, isActive ? Styles.containerActive : {})
  const textStyles = merge(Styles.text, isActive ? Styles.textActive : {})

  return (
    <div style={containerStyles} onClick={onClick}>
      <div style={textStyles}>{text}</div>
    </div>
  )
}

SectionLink.propTypes = {
  isActive: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default SectionLink
