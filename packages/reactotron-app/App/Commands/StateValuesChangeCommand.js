import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'
import Colors from '../Theme/Colors'
import isShallow from '../Lib/IsShallow'
import makeTable from '../Shared/MakeTable'
import { keys, concat, join } from 'ramda'
import { mapKeys, isNilOrEmpty } from 'ramdasauce'

const COMMAND_TITLE = 'SUBSCRIPTIONS'

const Styles = {
  name: {
    color: Colors.bold,
    margin: 0,
    paddingBottom: 10
  }
}

class StateValuesChangeCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  renderContent (action) {
    return isShallow ? makeTable(action) : <ObjectTree object={{action}} />
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const phrase = []
    let { changed, added, removed } = payload
    const hasAdded = !isNilOrEmpty(added)
    const hasRemoved = !isNilOrEmpty(removed)
    const hasChanged = !isNilOrEmpty(changed)
    if (hasChanged) {
      phrase.push(`${keys(changed).length} changed`)
    }
    if (hasAdded) {
      added = mapKeys(concat('+ '), added)
      phrase.push(`${keys(added).length} added`)
    }
    if (hasRemoved) {
      removed = mapKeys(concat('- '), removed)
      phrase.push(`${keys(removed).length} removed`)
    }
    const preview = join(' ', phrase)

    return (
      <Command command={command} title={COMMAND_TITLE} preview={preview}>
        <div style={Styles.container}>
          {hasChanged && this.renderContent(changed)}
          {hasAdded && this.renderContent(added)}
          {hasRemoved && this.renderContent(removed)}
        </div>
      </Command>
    )
  }
}

export default StateValuesChangeCommand
