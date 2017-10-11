import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'

const COMMAND_TITLE = 'UNKNOWN'

class UnknownCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  render () {
    const { command } = this.props
    const { payload, type } = command

    return (
      <Command command={command} title={COMMAND_TITLE} preview={type}>
        <ObjectTree object={{ payload }} />
      </Command>
    )
  }
}

export default UnknownCommand
