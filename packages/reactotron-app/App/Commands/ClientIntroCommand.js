import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import makeTable from '../Shared/MakeTable'

const COMMAND_TITLE = 'CONNECTION'

class ClientIntroCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const preview = payload.name

    return (
      <Command command={command} title={COMMAND_TITLE} preview={preview}>
        {makeTable(payload)}
      </Command>
    )
  }
}

export default ClientIntroCommand
