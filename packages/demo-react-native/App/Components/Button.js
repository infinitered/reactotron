import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Styles from './Styles/ButtonStyles'

class Button extends Component {

  static propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string
  }

  render () {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={Styles.container}>
        <Text style={Styles.text}>{this.props.text}</Text>
      </TouchableOpacity>
    )
  }

}

export default Button
