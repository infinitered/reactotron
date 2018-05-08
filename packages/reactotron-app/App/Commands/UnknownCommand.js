import { observer } from "mobx-react"
import PropTypes from "prop-types"
import React, { Component } from "react"
import Command from "../Shared/Command"
import ObjectTree from "../Shared/ObjectTree"

const COMMAND_TITLE = "UNKNOWN"

@observer
class UnknownCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
  }

  render() {
    const { command } = this.props
    const { payload, type } = command

    return (
      <Command {...this.props} title={COMMAND_TITLE} preview={type}>
        <ObjectTree object={{ payload }} />
      </Command>
    )
  }
}

export default UnknownCommand
