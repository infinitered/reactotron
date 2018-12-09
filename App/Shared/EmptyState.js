import PropTypes from "prop-types"
import React from "react"
import Colors from "../Theme/Colors"

const Styles = {
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  well: {
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    fontSize: 50,
    margin: 0,
    padding: 0,
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    color: Colors.foregroundLight,
    margin: 0,
    paddingBottom: 50,
    paddingTop: 10,
  },
  message: {
    textAlign: "center",
    maxWidth: 400,
    lineHeight: 1.4,
  },
}

const EmptyState = props => {
  const { icon, title } = props
  const Icon = icon && require(`react-icons/lib/md/${icon}`)
  return (
    <div style={Styles.container}>
      <div style={Styles.well}>
        {icon && <Icon size={100} />}
        <div style={Styles.title}>{title}</div>
        <div style={Styles.message}>{props.children}</div>
      </div>
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default EmptyState
