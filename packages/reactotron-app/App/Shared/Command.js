import { observer } from "mobx-react"
import PropTypes from "prop-types"
import React, { Component } from "react"
import DisplayIcon from "react-icons/lib/md/label"
import Timestamp from "../Shared/Timestamp"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import CommandToolbar from "./CommandToolbar"

const IconOpen = require("react-icons/lib/md/expand-more")
const IconClosed = require("react-icons/lib/md/chevron-right")

const Styles = {
  container: {
    ...AppStyles.Layout.hbox,
    marginTop: 0,
    alignItems: "flex-start",
    borderBottom: `1px solid ${Colors.line}`,
  },
  containerOpen: {
    backgroundColor: Colors.backgroundSubtleLight,
  },
  icon: {
    color: Colors.backgroundHighlight,
  },
  body: {
    ...AppStyles.Layout.vbox,
    marginLeft: 0,
  },
  topRow: {
    ...AppStyles.Layout.hbox,
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "15px 20px",
    cursor: "pointer",
  },
  title: {
    textAlign: "left",
    width: 168,
  },
  titleText: {
    color: Colors.tag,
  },
  titleTextInverse: {
    backgroundColor: Colors.tag,
    color: Colors.tagComplement,
    borderRadius: 4,
    padding: "4px 8px",
  },
  displayIcon: {
    marginRight: 4,
    marginBottom: 4,
  },
  displayIconSize: 16,
  preview: {
    color: Colors.highlight,
    textAlign: "left",
    paddingRight: 16,
    overflow: "hidden",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    flex: 1,
    wordBreak: "break-all",
  },
  duration: {
    color: Colors.foregroundDark,
    paddingRight: 10,
  },
  timestamp: {
    color: Colors.foregroundDark,
    paddingRight: 10,
  },
  spacer: {
    flex: 1,
  },
  children: {
    overflow: "hidden",
    animation: "fade-up 0.25s",
    willChange: "transform opacity",
    padding: "0 40px 30px 40px",
  },
}

@observer
class Command extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    preview: PropTypes.string,
    subtitle: PropTypes.string,
    duration: PropTypes.number,
  }

  state = {
    isOpen: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpen: props.startsOpen || false,
    }
    this.handleToggleOpen = this.handleToggleOpen.bind(this)
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   return !(equals(nextProps, this.props) && equals(this.state, nextState))
  // }

  handleToggleOpen() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { isOpen } = this.state
    const { command, children, title, preview, deltaTime } = this.props
    const { important, type } = command
    const isDisplay = type === "display"
    const { date } = command
    const titleTextStyle = { ...Styles.titleText, ...(important && Styles.titleTextInverse) }
    const topRowStyle = Styles.topRow
    const timestampStyle = Styles.timestamp
    const Icon = isOpen ? IconOpen : IconClosed
    const containerStyles = { ...Styles.container, ...(isOpen && Styles.containerOpen) }
    return (
      <div style={containerStyles}>
        <div style={Styles.body}>
          <div style={topRowStyle} onClick={this.handleToggleOpen}>
            <Timestamp date={date} style={timestampStyle} deltaTime={deltaTime} />
            <div style={Styles.title}>
              <span style={titleTextStyle}>
                {isDisplay && (
                  <DisplayIcon size={Styles.displayIconSize} style={Styles.displayIcon} />
                )}
                {title}
              </span>
            </div>
            {!isOpen && <span style={Styles.preview}>{preview}</span>}
            {isOpen && <CommandToolbar command={command} />}
            {isOpen && <span style={Styles.spacer} />}
            <Icon size={20} style={Styles.icon} />
          </div>
          {isOpen && <div style={Styles.children}>{children}</div>}
        </div>
      </div>
    )
  }
}

export default Command
