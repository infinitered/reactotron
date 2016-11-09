import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import Colors from '../Theme/Colors'
import Content from '../Shared/Content'
import AppStyles from '../Theme/AppStyles'
import { map } from 'ramda'
import IconStatusResolved from 'react-icons/lib/md/done'
import IconStatusRejected from 'react-icons/lib/md/error'
import IconStatusCancelled from 'react-icons/lib/md/eject'
import IconStatusWinner from 'react-icons/lib/md/done-all'

const COMMAND_TITLE = 'SAGA'
const INDENT_SPACE = 20
const I_AM_A_TRAINED_PROFESSIONAL = false

const STATUS_MAP = {
  'RESOLVED': <IconStatusResolved size={18} />,
  'REJECTED': <IconStatusRejected />,
  'CANCELLED': <IconStatusCancelled />
}

const Styles = {
  details: {
  },
  effects: {
  },
  giant: {
    borderTop: `1px solid ${Colors.line}`,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  effect: {
    ...AppStyles.Layout.hbox,
    paddingTop: 4,
    marginTop: 2,
    borderBottom: `1px solid ${Colors.subtleLine}`
  },
  effectStatus: {
    color: Colors.tag,
    paddingRight: 4
  },
  effectNameContainer: {
    width: 140,
    alignItems: 'center',
    marginBottom: 4
  },
  triggerType: {
    color: Colors.tag,
    paddingRight: 20
  },
  count: {
  },
  duration: {
    textAlign: 'right',
    flex: 1
  },
  effectName: {
    color: Colors.constant
  },
  winning: {
  },
  losing: {
    textDecoration: 'line-through',
    color: Colors.foregroundDark
  },
  effectExtra: {
    flex: 1
  },
  effectTitle: {
    ...AppStyles.Layout.hbox,
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
    const { extra, loser, winner, status, name, duration, depth } = effect
    const key = `effect-${effect.effectId}`
    const losingStyle = loser || status === 'CANCELLED' ? Styles.losing : {}
    const winningStyle = winner ? Styles.winning : {}
    const effectNameStyle = {
      ...Styles.effectName,
      paddingLeft: depth * INDENT_SPACE,
      ...losingStyle,
      ...winningStyle
    }
    const effectDurationStyle = {
      ...Styles.effectDuration,
      ...losingStyle
    }
    return (
      <div key={key} style={Styles.effect}>
        <div style={Styles.effectNameContainer}>
          <span style={effectNameStyle}>
            <span style={Styles.effectStatus}>
              { STATUS_MAP[status] }
            </span>
            { name }
          </span>
        </div>
        <div style={Styles.effectExtra}>
          { extra &&
            <Content value={{ '': extra }} treeLevel={0} />
          }
        </div>
        <div style={effectDurationStyle}>
          {duration}<span style={Styles.ms}>ms</span>
        </div>
      </div>
    )
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const { triggerType, duration, children, giantBagOfUnsortedStuff } = payload
    const preview = `${triggerType} in ${duration}ms`
    const effectTitle = `${children.length} Effect${children.length > 0 && 's'}`

    return (
      <Command command={command} title={COMMAND_TITLE} preview={preview}>
        <div style={Styles.effects}>
          <div style={Styles.effectTitle}>
            <div style={Styles.triggerType}>
              {triggerType}
            </div>
            <div style={Styles.count}>{effectTitle}</div>
            <div style={Styles.duration}>{duration}<span style={Styles.ms}>ms</span></div>
          </div>
          {map(this.renderEffect.bind(this), children)}
        </div>
        { I_AM_A_TRAINED_PROFESSIONAL &&
          <div style={Styles.giant}>
            <Content value={{ ...giantBagOfUnsortedStuff }} />
          </div>
        }
      </Command>
    )
  }
}

export default SagaTaskCompleteCommand
