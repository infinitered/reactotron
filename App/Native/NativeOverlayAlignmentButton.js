import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../Theme/Colors'
import { merge } from 'ramda'

const Icon = require(`react-icons/lib/md/stop`)
const Styles = {
  container: {
    color: Colors.subtleLine,
    cursor: 'pointer'
  },
  containerActive: {
    color: Colors.bold
  },
  iconSize: 32
}

const NativeOverlayAlignmentButton = props => {
  const { selectedJustifyContent, selectedAlignItems, onClick, justifyContent, alignItems } = props
  const isActive = selectedJustifyContent === justifyContent && selectedAlignItems === alignItems
  const containerStyles = merge(Styles.container, isActive ? Styles.containerActive : {})
  const handleClick = event => {
    event.stopPropagation()
    event.preventDefault()
    onClick(justifyContent, alignItems)
  }

  return (
    <div style={containerStyles} onClick={handleClick}>
      <Icon size={Styles.iconSize} />
    </div>
  )
}

NativeOverlayAlignmentButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  justifyContent: PropTypes.string.isRequired,
  alignItems: PropTypes.string.isRequired
}

export default NativeOverlayAlignmentButton
