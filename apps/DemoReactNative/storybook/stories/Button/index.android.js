import React from 'react';
import PropTypes from 'prop-types';
import {TouchableNativeFeedback} from 'react-native';

export default function Button(props) {
  return (
    <TouchableNativeFeedback onPress={props.onPress}>
      {props.children}
    </TouchableNativeFeedback>
  );
}

Button.defaultProps = {
  children: null,
  onPress: () => {},
};

Button.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func,
};
