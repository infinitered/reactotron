import React, { Component } from "react"
import {
  MDCreate as IconRename,
  MDDelete as IconDelete,
  MDFileUpload as IconUpload,
  MDCallReceived as IconCopy,
} from "react-icons/md"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"
import Content from "../Shared/Content"

const Styles = {
  container: {
    overflow: "hidden",
    borderBottom: `1px solid ${Colors.line}`,
  },
  row: {
    ...AppStyles.Layout.hbox,
    padding: "15px 20px",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  name: {
    color: Colors.tag,
    textAlign: "left",
    flex: 1,
  },
  iconSize: 24,
  upload: {
    paddingRight: 10,
    cursor: "pointer",
  },
  button: {
    cursor: "pointer",
    paddingLeft: 10,
  },
  children: {
    overflow: "hidden",
    animation: "fade-up 0.25s",
    willChange: "transform opacity",
    padding: "0 40px 30px 40px",
  },
}

export default class BackupItem extends Component {
  state = {
    isOpen: false,
  }

  handleToggle = event => {
    event.stopPropagation()
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }))
  }

  handleRemove = event => {
    event.stopPropagation()
    this.props.onRemove(this.props.backup)
  }

  handleRename = event => {
    event.stopPropagation()
    this.props.onRename(this.props.backup)
  }

  handleRestore = event => {
    event.stopPropagation()
    this.props.onRestore(this.props.backup)
  }

  handleExport = event => {
    event.stopPropagation()
    this.props.onExport(this.props.backup)
  }

  render() {
    const {
      backup: { name, state },
    } = this.props
    const { isOpen } = this.state

    return (
      <div style={Styles.container}>
        <div style={Styles.row} onClick={this.handleToggle}>
          <div style={Styles.name}>{name}</div>
          <IconCopy size={Styles.iconSize} style={Styles.button} onClick={this.handleExport} />
          <IconUpload size={Styles.iconSize} style={Styles.button} onClick={this.handleRestore} />
          <IconRename size={Styles.iconSize} style={Styles.button} onClick={this.handleRename} />
          <IconDelete size={Styles.iconSize} style={Styles.button} onClick={this.handleRemove} />
        </div>
        {isOpen && (
          <div style={Styles.children}>
            <Content value={state} />
          </div>
        )}
      </div>
    )
  }
}
