import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import Colors from '../Theme/Colors'
import Content from '../Shared/Content'
import makeTable from '../Shared/MakeTable'
import { props, fromPairs, map } from 'ramda'

const COMMAND_TITLE = 'SAGA'
const Styles = {
  details: {
  },
  effects: {
    paddingTop: 10
  },
  giant: {
    borderTop: `1px solid ${Colors.line}`,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10
  }
}
class SagaTaskCompleteCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const { triggerType, duration, children, giantBagOfUnsortedStuff } = payload
    const preview = `${triggerType} in ${duration}ms`
    const details = {
      'Triggered By Action': triggerType,
      'Duration (ms)': duration
    }

    const kids = fromPairs(map(props(['name', 'duration']), children))

    return (
      <Command command={command} title={COMMAND_TITLE} preview={preview}>
        <div style={Styles.details}>
          {makeTable(details)}
        </div>
        <div style={Styles.effects}>
          <Content value={kids} />
        </div>
        <div style={Styles.giant}>Giant Bag of Unsorted Stuff</div>
        <Content value={{ ...giantBagOfUnsortedStuff }} />
      </Command>
    )
  }
}

export default SagaTaskCompleteCommand
