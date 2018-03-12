import React from "react"
import PropTypes from "prop-types"
import moment from "moment"
import Colors from "../Theme/Colors"
import { format } from "date-fns"

const Styles = {
  container: { margin: 0, padding: 0 },
  left: { color: Colors.highlight },
  right: { color: Colors.foreground },
}

const Timestamp = props => {
  const date = props.date
  const left = format(date, "h:mm:")
  const right = format(date, "ss.SS")
  const containerStyles = { ...Styles.container, ...props.style }

  return (
    <span style={containerStyles}>
      <span style={Styles.left}>{left}</span>
      <span style={Styles.right}>{right}</span>
    </span>
  )
}

Timestamp.propTypes = {
  date: PropTypes.object.isRequired,
  style: PropTypes.object,
}

export default Timestamp
