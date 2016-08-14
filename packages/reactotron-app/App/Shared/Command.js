import React, { Component, PropTypes } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import Timestamp from '../Shared/Timestamp'
import { observer } from 'mobx-react'
import { isNilOrEmpty } from 'ramdasauce'
import { is } from 'ramda'
const Icon = require('react-icons/lib/md/arrow-drop-down')

const MS_LABEL = 'ms'

const Styles = {
  container: {
    ...AppStyles.Layout.hbox,
    marginBottom: 8,
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 24,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'flex-start',
    borderBottom: `1px solid ${Colors.backgroundLighter}`
  },
  icon: {
    color: Colors.foregroundDark,
    paddingRight: 4,
  },
  body: {
    ...AppStyles.Layout.vbox,
    marginLeft: 0
  },
  topRow: {
    ...AppStyles.Layout.hbox,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  title: {
    color: Colors.tag,
    textAlign: 'left',
    fontSize: 'larger'
    // borderBottom: `1px solid ${Colors.highlight}`
  },
  subtitle: {
    color: Colors.foreground,
    textAlign: 'left',
    paddingLeft: 8
  },
  duration: {
    color: Colors.foregroundDark,
    paddingRight: 10
  },
  timestamp: {
    color: Colors.foregroundDark
  },
  spacer: {
    flex: 1
  },
  children: {
    minHeight: 40,
    overflow: 'hidden',
    animation: 'fade-up 0.25s',
    willChange: 'transform opacity',
  }
}

@observer
class Command extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    duration: PropTypes.number
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (this.props.command.id !== nextProps.command.id)
  }

  render () {
    const { command, children, title, subtitle, duration } = this.props
    const hasSubtitle = !isNilOrEmpty(subtitle)
    const hasDuration = is(Number, duration)
    const ms = hasDuration && Number(duration).toFixed(0)
    const { date } = command
    const titleStyle = Styles.title
    const topRowStyle = Styles.topRow
    const timestampStyle = Styles.timestamp
    return (
      <div style={Styles.container}>
        <div style={Styles.body}>
          <div style={topRowStyle}>
            <span style={titleStyle}>{title}</span>
            <Icon size={24} style={Styles.icon} />
            {hasSubtitle && <span style={Styles.subtitle}>{subtitle}</span>}
            <span style={Styles.spacer}></span>
            {hasDuration && <span style={Styles.duration}>{ms}{MS_LABEL}</span>}
            <Timestamp date={date} style={timestampStyle} />
          </div>
          <div style={Styles.children}>
            {children}
          </div>
        </div>
      </div>
    )
  }

}

export default Command
