import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Colors from '../Theme/Colors'

const Styles = {
  container: {
    fontSize: 13,
    margin: 0,
    padding: 0
  },
  left: { color: Colors.text },
  right: { color: Colors.text }
}

class Timestamp extends Component {

  static propTypes = {
    date: PropTypes.object.isRequired,
    style: PropTypes.object
  }

  render () {
    const date = moment(this.props.date)
    const left = date.format('hh:mm:')
    // const right = date.format('ss.SS')
    const right = date.format('ss A')
    const containerStyles = {...Styles.container, ...this.props.style}
    return (
      <span style={containerStyles}>
        <span style={Styles.left}>{left}</span>
        <span style={Styles.right}>{right}</span>
      </span>
    )
  }
}

export default Timestamp
