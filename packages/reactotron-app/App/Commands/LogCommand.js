import React, { Component, PropTypes } from 'react'
import Command from '../Shared/Command'
import ObjectTree from '../Shared/ObjectTree'
import { take, replace, merge, map, trim, split } from 'ramda'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'

const STACK_TITLE = 'YE OLDE STACK TRACE'
const PREVIEW_LENGTH = 500

const getName = level => {
  switch (level) {
    case 'debug': return 'DEBUG'
    case 'warn': return 'WARNING'
    case 'error': return 'ERROR'
    default: return 'LOG'
  }
}
let spanCount = 0
const breakIntoSpans = (part) => {
  spanCount++
  return (
    <span key={`span-${spanCount}`}>{part}<br /></span>
  )
}

const formatMessage = message => {
  if (typeof message === 'string') {
    return (
      <div>
        {map(breakIntoSpans, split('\n', trim(message)))}
      </div>
    )
  } else if (typeof message === 'object') {
    return <ObjectTree object={{payload: message}} />
  }
}

const Styles = {
  container: {
    paddingTop: 4
  },
  stack: {
    marginTop: 10,
    ...AppStyles.Layout.vbox
  },
  stackFrame: {
    marginBottom: 10,
    flex: 1,
    wordBreak: 'break-all'
  },
  number: {
    paddingRight: 7,
    color: Colors.constant
  },
  stackMiddle: {
  },
  fileName: {
    wordBreak: 'break-all'
  },
  lineNumber: {
    color: Colors.bold,
    wordBreak: 'break-all'
  },
  stackLabel: {
    color: Colors.foregroundDark,
    margin: '0 7px',
    wordBreak: 'break-all'
  },
  stackTitle: {
    color: Colors.constant,
    paddingBottom: 10,
    wordBreak: 'break-all'
  }
}

class LogCommand extends Component {

  static propTypes = {
    command: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.renderStackFrame = this.renderStackFrame.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return this.props.command.id !== nextProps.command.id
  }

  renderStackFrame (stackFrame, number) {
    const key = `stack-${number}`
    let { fileName, functionName, lineNumber } = stackFrame
    fileName = fileName && replace('webpack://', '', fileName)
    functionName = functionName && replace('webpack://', '', functionName)
    return (
      <div key={key} style={Styles.stackFrame}>
        <span style={Styles.number}>{number}.</span>
        <span style={Styles.functionName}>{functionName || '(anonymous function)'}</span>
        <span style={Styles.stackLabel}>:</span>
        <span style={Styles.filename}>{fileName} : </span>
        <span style={Styles.lineNumber}>{lineNumber}</span>
      </div>
    )
  }

  renderStack (stack) {
    let i = 0
    return (
      <div style={Styles.stack}>
        <div style={Styles.stackTitle}>{STACK_TITLE}</div>
        {map(stackFrame => {
          i++
          return this.renderStackFrame(stackFrame, i)
        }, stack)}
      </div>
    )
  }

  getPreview (message) {
    if (typeof message === 'string') {
      return `${take(PREVIEW_LENGTH, message)}`
    }
    return null
  }

  render () {
    const { command } = this.props
    const { payload } = command
    const { level } = payload
    const { message, stack } = payload
    const title = getName(level)
    const containerTypes = merge(Styles.container, { color: level === 'debug' ? Colors.foreground : Colors.foreground })

    let preview = this.getPreview(message)

    return (
      <Command command={command} title={title} preview={preview}>
        <div style={containerTypes}>
          {formatMessage(message)}
          {stack && this.renderStack(stack)}
        </div>
      </Command>
    )
  }
}

export default LogCommand
