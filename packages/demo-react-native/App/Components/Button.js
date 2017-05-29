import React, { Component, PropTypes } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Styles from './Styles/ButtonStyles'
import { merge } from 'ramda'

class Button extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string,
    style: PropTypes.object
  }

  render () {
    const containerStyle = this.props.style
      ? merge(Styles.container, this.props.style)
      : Styles.container

    return (
      <TouchableOpacity onPress={this.props.onPress} style={containerStyle}>
        <Text style={Styles.text}>{this.props.text}</Text>
      </TouchableOpacity>
    )
  }
}

export default Button
