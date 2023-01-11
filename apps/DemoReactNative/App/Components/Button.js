import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableOpacity} from 'react-native';
import Styles from './Styles/ButtonStyles';
import {mergeRight} from 'ramda';

class Button extends Component {
  render() {
    let containerStyle = this.props.style
      ? mergeRight(Styles.container, this.props.style)
      : Styles.container;

    const onPress = this.props.disable ? null : this.props.onPress;

    if (this.props.disable) {
      containerStyle = {...containerStyle, backgroundColor: 'red'};
    }

    return (
      <TouchableOpacity
        activeOpacity={this.props.disable ? 1 : 0.5}
        onPress={onPress}
        style={containerStyle}>
        <Text style={Styles.text}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
  style: PropTypes.object,
  disable: PropTypes.bool,
};

export default Button;
