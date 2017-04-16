import React, { Component, PropTypes } from 'react'
import Colors from '../Theme/Colors'

const Styles = {
  container: {
    color: Colors.background,
    textTransform: 'uppercase',
    borderRadius: 4,
    backgroundColor: Colors.foreground,
    padding: '4px 12px',
    fontWeight: 'bold',
    borderBottom: `2px solid ${Colors.highlight}`,
    marginLeft: 2,
    marginRight: 2
  }
}

class Key extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  }

  render () {
    const { text } = this.props

    return (
      <span style={Styles.container}>
        {text}
      </span>
    )
  }
}

export default Key
