import React from "react"
import PropTypes from "prop-types"
import moment from "moment"
import Colors from "../Theme/Colors"
import { format } from "date-fns"

const Styles = {
  container: { margin: 0, padding: 0, position: "relative" },
  left: { color: Colors.highlight },
  right: { color: Colors.foreground },
  delta: {
    color: Colors.tag,
    fontSize: `0.7rem`,
    position: "absolute",
    top: -12,
    right: 0,
    left: 0,
  },
}

const Timestamp = props => {
  const date = props.date
  const left = format(date, "h:mm:")
  const right = format(date, "ss.SSS")
  const containerStyles = { ...Styles.container, ...props.style }
  const delta = props.deltaTime ? `+${props.deltaTime} ms` : ""

  return (
    <div style={containerStyles}>
      <span style={Styles.left}>{left}</span>
      <span style={Styles.right}>{right}</span>
      <span title='Since last Reactotron message' style={Styles.delta}>{delta}</span>
    </div>
  )
}

Timestamp.propTypes = {
  date: PropTypes.object.isRequired,
  deltaTime: PropTypes.number,
  style: PropTypes.object,
}

export default Timestamp
