import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import Content from '../Shared/Content'

const COMMAND_TITLE = 'DISPLAY'

class DisplayCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  render () {
    const { command } = this.props
    const { payload, important } = command
    const { name, value, preview } = payload

    return (
      <Command command={command} title={name || COMMAND_TITLE} important={important} preview={preview}>
        <Content value={value} />
      </Command>
    )
  }
}

export default DisplayCommand
