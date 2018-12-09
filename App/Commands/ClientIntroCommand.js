import { observer } from "mobx-react"
import PropTypes from "prop-types"
import React, { Component } from "react"
import Command from "../Shared/Command"
import makeTable from "../Shared/MakeTable"

const COMMAND_TITLE = "CONNECTION"

@observer
class ClientIntroCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
  }

  render() {
    const { command } = this.props
    const { payload } = command
    const preview = payload.name

    return (
      <Command {...this.props} title={COMMAND_TITLE} preview={preview}>
        {makeTable(payload)}
      </Command>
    )
  }
}

export default ClientIntroCommand
