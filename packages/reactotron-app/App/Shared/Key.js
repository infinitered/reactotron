import React from 'react'
import PropTypes from 'prop-types'
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

const Key = props => {
  const { text } = props

  return <span style={Styles.container}>{text}</span>
}

Key.propTypes = {
  text: PropTypes.string.isRequired
}

export default Key
