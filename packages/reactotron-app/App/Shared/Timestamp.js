import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Colors from '../Theme/Colors'

const Styles = {
  container: {
    margin: 0,
    padding: 0
  },
  left: {
    color: Colors.foregroundDark
  },
  right: {
    color: Colors.foreground
  }
}

const Timestamp = props => {
  const date = moment(props.date)
  const left = date.format('h:mm')
  // const right = date.format('ss.SS')
  const right = date.format(':ss')
  const containerStyles = { ...Styles.container, ...props.style }

  return (
    <span style={containerStyles}>
      <span style={Styles.left}>{left}</span>
      <span style={Styles.right}>{right}</span>
    </span>
  )
}

Timestamp.ropTypes = {
  date: PropTypes.object.isRequired,
  style: PropTypes.object
}

export default Timestamp
