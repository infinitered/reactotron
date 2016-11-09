import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import Colors from '../Theme/Colors'
import Content from '../Shared/Content'
import makeTable from '../Shared/MakeTable'
import AppStyles from '../Theme/AppStyles'
import { map } from 'ramda'

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
  },
  effect: {
    ...AppStyles.Layout.hbox
  },
  effectName: {
    width: 50,
    color: Colors.bold
  },
  effectDuration: {
    textAlign: 'right',
    width: 50
  },
  effectTitle: {
    color: Colors.foregroundDark,
    borderBottom: `1px solid ${Colors.highlight}`,
    paddingBottom: 4,
    marginBottom: 4
  },
  ms: {
    color: Colors.foregroundDark
  }
}
class SagaTaskCompleteCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  renderEffect (effect) {
    const key = `effect-${effect.effectId}`
    return (
      <div key={key} style={Styles.effect}>
        <div style={Styles.effectName}>{effect.name}</div>
        <div style={Styles.effectDuration}>{effect.duration}<span style={Styles.ms}>ms</span></div>
      </div>
    )
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
    const effectTitle = `${children.length} Effect${children.length > 0 && 's'}`

    return (
      <Command command={command} title={COMMAND_TITLE} preview={preview}>
        <div style={Styles.details}>
          {makeTable(details)}
        </div>
        <div style={Styles.effects}>
          <div style={Styles.effectTitle}>{effectTitle}</div>
          {map(this.renderEffect.bind(this), children)}
        </div>
        <div style={Styles.giant}>Giant Bag of Unsorted Stuff</div>
        <Content value={{ ...giantBagOfUnsortedStuff }} />
      </Command>
    )
  }
}

export default SagaTaskCompleteCommand
