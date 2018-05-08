import { observer } from "mobx-react"
import PropTypes from "prop-types"
import React, { Component } from "react"
import Command from "../Shared/Command"
import Content from "../Shared/Content"
import Colors from "../Theme/Colors"

const COMMAND_TITLE = "ACTION"

const Styles = {
  name: {
    color: Colors.bold,
    margin: 0,
    paddingBottom: 10,
  },
}

@observer
class StateActionComplete extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
  }

  render() {
    const { command } = this.props
    const { payload } = command
    const { ms, action, name } = payload
    const preview = `${name}`

    return (
      <Command {...this.props} title={COMMAND_TITLE} duration={ms} preview={preview}>
        <div style={Styles.container}>
          <div style={Styles.name}>{name}</div>
          <Content value={action} />
        </div>
      </Command>
    )
  }
}

export default StateActionComplete
