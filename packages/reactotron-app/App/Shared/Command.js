import React, { Component, PropTypes } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import Timestamp from '../Shared/Timestamp'
import { observer } from 'mobx-react'
import { isNilOrEmpty } from 'ramdasauce'
import { is, merge } from 'ramda'

const Styles = {
  container: {
    ...AppStyles.Layout.hbox,
    marginBottom: 8,
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 16,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'flex-start'
  },
  body: {
    ...AppStyles.Layout.vbox,
    marginLeft: 10
  },
  topRow: {
    ...AppStyles.Layout.hbox,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingBottom: 4,
    borderBottom: `1px solid ${Colors.subtleLine}`
  },
  title: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'left'
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'left',
    paddingLeft: 8
  },
  duration: {
    fontSize: 14,
    color: Colors.text,
    paddingRight: 10
  },
  timestamp: {
    fontSize: 14,
    color: Colors.mutedText
  },
  spacer: {
    flex: 1
  },
  children: {
    minHeight: 40,
    overflow: 'hidden',
    animation: 'fade-up 0.25s',
    willChange: 'transform opacity'
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
    const { command, children, title, subtitle, duration, color = Colors.primary } = this.props
    const hasSubtitle = !isNilOrEmpty(subtitle)
    const hasDuration = is(Number, duration)
    const ms = hasDuration && Number(duration).toFixed(0)
    const { date } = command
    const titleStyle = merge(Styles.title, { color })
    const topRowStyle = merge(Styles.topRow, { borderBottomColor: color })
    return (
      <div style={Styles.container}>
        <div style={Styles.body}>
          <div style={topRowStyle}>
            <span style={titleStyle}>{title}</span>
            {hasSubtitle && <span style={Styles.subtitle}>{subtitle}</span>}
            <span style={Styles.spacer}></span>
            {hasDuration && <span style={Styles.duration}>{ms} ms</span>}
            <Timestamp date={date} style={Styles.timestamp} />
          </div>
          <div style={Styles.children} className='fade-it'>
            {children}
          </div>
        </div>
      </div>
    )
  }

}

export default Command
