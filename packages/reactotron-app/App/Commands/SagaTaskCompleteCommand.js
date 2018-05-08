import { inject, observer } from "mobx-react"
import PropTypes from "prop-types"
import { map } from "ramda"
import React, { Component } from "react"
import IconStatusResolved from "react-icons/lib/md/done"
import IconStatusCancelled from "react-icons/lib/md/eject"
import IconStatusRejected from "react-icons/lib/md/error"
import Command from "../Shared/Command"
import Content from "../Shared/Content"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"

const COMMAND_TITLE = "SAGA"
const INDENT_SPACE = 20

const STATUS_MAP = {
  RESOLVED: <IconStatusResolved size={18} />,
  REJECTED: <IconStatusRejected />,
  CANCELLED: <IconStatusCancelled />,
}

const Styles = {
  details: {},
  effects: {},
  giant: {
    borderTop: `1px solid ${Colors.line}`,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  effect: {
    ...AppStyles.Layout.hbox,
    paddingTop: 4,
    marginTop: 2,
    borderBottom: `1px solid ${Colors.subtleLine}`,
  },
  effectStatus: {
    color: Colors.tag,
    paddingRight: 4,
  },
  effectNameContainer: {
    width: 140,
    alignItems: "center",
    marginBottom: 4,
  },
  triggerType: {
    color: Colors.tag,
    paddingRight: 20,
  },
  count: {},
  duration: {
    textAlign: "right",
    flex: 1,
  },
  effectName: {
    color: Colors.constant,
  },
  effectDescription: {
    paddingBottom: 4,
  },
  winning: {},
  losing: {
    textDecoration: "line-through",
    color: Colors.foregroundDark,
  },
  effectExtra: {
    flex: 1,
  },
  effectTitle: {
    ...AppStyles.Layout.hbox,
    borderBottom: `1px solid ${Colors.highlight}`,
    paddingBottom: 4,
    marginBottom: 4,
  },
  ms: {
    color: Colors.foregroundDark,
  },
}

@inject("session")
@observer
class SagaTaskCompleteCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.renderEffect = this.renderEffect.bind(this)
  }

  renderEffect(effect) {
    const { extra, loser, winner, status, name, description, duration, depth, result } = effect
    const key = `effect-${effect.effectId}`
    const losingStyle = loser || status === "CANCELLED" ? Styles.losing : {}
    const winningStyle = winner ? Styles.winning : {}
    const effectNameStyle = {
      ...Styles.effectName,
      paddingLeft: depth * INDENT_SPACE,
      ...losingStyle,
      ...winningStyle,
    }
    const effectDurationStyle = {
      ...Styles.effectDuration,
      ...losingStyle,
    }
    const { session, command } = this.props
    const { ui } = session
    const { messageId } = command
    const showInOut = ui.getCommandProperty(messageId, "details")
    return (
      <div key={key} style={Styles.effect}>
        <div style={Styles.effectNameContainer}>
          <span style={effectNameStyle}>
            <span style={Styles.effectStatus}>{STATUS_MAP[status]}</span>
            {name}
          </span>
        </div>
        <div style={Styles.effectExtra}>
          {extra && (
            <div>
              <div style={Styles.effectDescription}>{description}</div>
              {showInOut && <Content value={{ in: extra, out: result }} treeLevel={0} />}
            </div>
          )}
        </div>
        <div style={effectDurationStyle}>
          {duration}
          <span style={Styles.ms}>ms</span>
        </div>
      </div>
    )
  }

  render() {
    const { command } = this.props
    const { payload } = command
    const { description, triggerType, duration, children } = payload
    const preview = `${triggerType} in ${duration}ms`
    const effectTitle = `${children.length} Effect${children.length === 1 ? "" : "s"}`

    return (
      <Command {...this.props} title={COMMAND_TITLE} preview={preview}>
        <div style={Styles.effects}>
          <div style={Styles.effectTitle}>
            <div style={Styles.triggerType}>{description || triggerType}</div>
            <div style={Styles.count}>{effectTitle}</div>
            <div style={Styles.duration}>
              {duration}
              <span style={Styles.ms}>ms</span>
            </div>
          </div>
          {map(this.renderEffect, children)}
        </div>
      </Command>
    )
  }
}

export default SagaTaskCompleteCommand
