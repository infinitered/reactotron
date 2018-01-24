import React from 'react'
import PropTypes from 'prop-types'
import { TouchableHighlight } from 'react-native'

export default function Button (props) {
  return <TouchableHighlight onPress={props.onPress}>{props.children}</TouchableHighlight>
}

Button.defaultProps = {
  children: null,
  onPress: () => {}
}

Button.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func
}
