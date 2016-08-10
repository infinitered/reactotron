import React, { Component, PropTypes } from 'react'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import Timestamp from './Timestamp'
import { observer } from 'mobx-react'
import DebugIcon from 'react-icons/lib/md/info'
import WarningIcon from 'react-icons/lib/md/warning'
import ErrorIcon from 'react-icons/lib/md/error'
import { trim, map, split, merge } from 'ramda'
import JSONTree from 'react-json-tree'

const levelText = {
  fontSize: 12,
  marginTop: 12,
  marginBottom: 0,
  padding: 0
}

const Styles = {
  container: {
    // paddingTop: 4,
    // paddingBottom: 4,
    // minHeight: 80,
    // border: `1px solid ${Colors.line}`,
    // borderRadius: 6,
    // marginBottom: 8,
    // borderLeft: `8px solid ${Colors.primary}`,
    // backgroundColor: Colors.toolbar,
    // overflow: 'hidden',

    borderBottom: `1px solid ${Colors.line}`,
    marginBottom: 8,
    marginTop: 8,
    paddingTop: 0,
    paddingBottom: 16,

    ...AppStyles.Layout.hbox
  },
  containerWarning: {
    borderColor: Colors.line
  },
  containerError: {
    borderColor: Colors.line
  },
  containerDebug: {
    borderColor: Colors.line
  },
  col1: {
    width: 60,
    alignSelf: 'flex-start',
    marginTop: 12,
    textAlign: 'center'
  },
  col2: {
    width: 100
  },
  col3: {
    flex: 1
  },
  message: {
    marginTop: 10,
    marginBottom: 0
  },
  messageError: { color: Colors.error },
  messageWarning: { color: Colors.warning },
  messageDebug: { },
  levelTextDebug: {
    ...levelText,
    color: Colors.primary
  },
  levelTextWarning: {
    ...levelText,
    color: Colors.warning
  },
  levelTextError: {
    ...levelText,
    color: Colors.error
  },
  icon: {
  },
  iconSize: 30,
  json: {
    flex: 1
  }
}

@observer
class LogMessage extends Component {

  static propTypes = {
    log: PropTypes.object.isRequired
  }

  getIcon (level) {
    switch (level) {
      case 'error': return <ErrorIcon size={Styles.iconSize} color={Colors.error} />
      case 'warn': return <WarningIcon size={Styles.iconSize} color={Colors.warning} />
      default: return <DebugIcon size={Styles.iconSize} color={Colors.primary} />
    }
  }

  getContainerStyles (level) {
    switch (level) {
      case 'error': return Styles.containerError
      case 'warn': return Styles.containerWarning
      default: return Styles.containerDebug
    }
  }

  getLevelText (level) {
    switch (level) {
      case 'error': return <p style={Styles.levelTextError}>ERROR</p>
      case 'warn': return <p style={Styles.levelTextWarning}>WARNING</p>
      default: return <p style={Styles.levelTextDebug}>DEBUG</p>
    }
  }

  chop (part) {
    return (
      <span>{part}<br /></span>
    )
  }

  renderJson (jsonObject) {
    const theme = {
      tree: {
        backgroundColor: 'transparent'
      },
      label: {
        color: Colors.text
      },
      arrowSign: {
        borderTopColor: Colors.text
      }
    }
    return (
      <div style={Styles.json}>
        <JSONTree data={jsonObject} hideRoot theme={theme} />
      </div>
    )
  }

  formatMessage (message) {
    if (typeof message === 'string') {
      return (
        <div>
          {map(this.chop, split('\n', trim(message)))}
        </div>
      )
    } else if (typeof message === 'object') {
      return this.renderJson(message)
      // return <pre>{JSON.stringify(message, 2, 2)}</pre>
    }
  }

  getMessageStyle (level) {
    switch (level) {
      case 'error': return { ...Styles.message, ...Styles.messageError }
      case 'warn': return { ...Styles.message, ...Styles.messageWarning }
      default: return { ...Styles.message, ...Styles.messageDebug }
    }
  }

  render () {
    const { log } = this.props
    const { payload, date } = log
    const { message, level } = payload
    const containerStyles = merge(Styles.container, this.getContainerStyles(level))
    const messageStyle = this.getMessageStyle(level)
    return (
      <div style={containerStyles}>
        <div style={Styles.col1}>
          {this.getIcon(level)}
        </div>
        <div style={Styles.col2}>
          {this.getLevelText(level)}
          <Timestamp date={date} />
        </div>
        <div style={Styles.col3}>
          <p style={messageStyle}>{this.formatMessage(message)}</p>
        </div>
      </div>
    )
  }

}

export default LogMessage
