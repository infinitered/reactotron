import React, { Component } from "react"
import PropTypes from "prop-types"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import { mergeAll } from "ramda"

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    flex: 0,
    alignItems: "center",
    color: Colors.highlight,
    cursor: "pointer",
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  containerTop: {
    borderTop: 0,
  },
  containerActive: {
    color: Colors.foregroundLight,
  },
  iconSize: 32,
  text: {
    paddingTop: 2,
    textAlign: "center",
    fontSize: 12,
    whiteSpace: "nowrap",
  },
}

class SubNavButton extends Component {
  handleClick = () => {
    this.props.onClick(this.props.name)
  }

  render() {
    const { icon, isActive, hideTopBorder, text } = this.props
    const Icon = require(`react-icons/lib/md/${icon}`)
    const containerStyles = mergeAll([
      Styles.container,
      isActive ? Styles.containerActive : {},
      hideTopBorder ? Styles.containerTop : {},
    ])
    const hasText = text && text.length > 0

    return (
      <div style={containerStyles} onClick={this.handleClick}>
        <Icon size={Styles.iconSize} />
        {hasText && <div style={Styles.text}>{text}</div>}
      </div>
    )
  }
}

SubNavButton.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  hideTopBorder: PropTypes.bool,
}

export default SubNavButton
