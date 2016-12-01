import React, { Component, PropTypes } from 'react'
import { inject, observer } from 'mobx-react'
import Command from '../Shared/Command'
import { take, replace, merge, map, split, last } from 'ramda'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import Content from '../Shared/Content'
import ReactTooltip from 'react-tooltip'

const PREVIEW_LENGTH = 500

const getName = level => {
  switch (level) {
    case 'debug': return 'DEBUG'
    case 'warn': return 'WARNING'
    case 'error': return 'ERROR'
    default: return 'LOG'
  }
}

const stackFrameBaseStyle = {
  marginBottom: 10,
  flex: 1,
  wordBreak: 'break-all',
  cursor: 'pointer'
}

const Styles = {
  container: {
    paddingTop: 4
  },
  stack: {
    marginTop: 10,
    ...AppStyles.Layout.vbox
  },
  stackTable: {
  },
  stackFrame: {
    ...stackFrameBaseStyle
  },
  stackFrameNodeModule: {
    ...stackFrameBaseStyle,
    opacity: 0.4
  },
  number: {
    color: Colors.constant,
    textAlign: 'right',
    width: 50,
    paddingRight: 10,
    paddingTop: 3
  },
  functionName: {
    paddingRight: 10,
    paddingTop: 3
  },
  fileName: {
    wordBreak: 'break-all',
    paddingRight: 10,
    paddingTop: 3
  },
  lineNumber: {
    color: Colors.bold,
    wordBreak: 'break-all',
    width: 50,
    textAlign: 'right',
    paddingTop: 3
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
  },
  headerFrame: {
    textAlign: 'left',
    width: 50,
    paddingRight: 10
  },
  headerFunction: {
    textAlign: 'left'
  },
  headerFile: {
    textAlign: 'left'
  },
  headerLineNumber: {
    textAlign: 'right',
    width: 50
  },
  errorMessage: {
    wordBreak: 'break-all',
    fontSize: 24,
    paddingBottom: 5,
    marginBottom: 10,
    borderBottom: `1px solid ${Colors.tag}`
  }
}

@inject('session')
@observer
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
    const { session } = this.props
    const { ui } = session
    const key = `stack-${number}`
    let { fileName, functionName, lineNumber } = stackFrame
    const justTheFile = last(split('/', fileName))
    fileName = fileName && replace('webpack://', '', fileName)
    functionName = functionName && replace('webpack://', '', functionName)
    const isNodeModule = fileName.indexOf('/node_modules/') >= 0
    const onClickStackFrame = e =>
      ui.openInEditor(fileName, lineNumber)

    const style = isNodeModule ? Styles.stackFrameNodeModule : Styles.stackFrame
    const tooltip = fileName

    return (
      <tr key={key} style={style} onClick={onClickStackFrame}>
        <td style={Styles.number}>{number}.</td>
        <td style={Styles.functionName}>{functionName || '(anonymous function)'}</td>
        <td style={Styles.fileName} data-tip={tooltip} >
          {justTheFile}
          <ReactTooltip place='bottom' class='tooltipThemeReducedWidth' />
        </td>
        <td style={Styles.lineNumber}>{lineNumber}</td>
      </tr>
    )
  }

  renderStack (stack) {
    let i = 0
    return (
      <div style={Styles.stack}>
        <table style={Styles.stackTable} width='100%'>
          <thead>
            <tr>
              <th style={Styles.headerFrame}>Frame</th>
              <th style={Styles.headerFunction}>Function</th>
              <th style={Styles.headerFile}>File</th>
              <th style={Styles.headerLineNumber}>line</th>
            </tr>
          </thead>
          <tbody>
            {map(stackFrame => {
              i++
              return this.renderStackFrame(stackFrame, i)
            }, stack)}
          </tbody>
        </table>
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
          {!stack && <Content value={message} />}
          {stack && <div style={Styles.errorMessage}>{ message }</div>}
          {stack && this.renderStack(stack)}
        </div>
      </Command>
    )
  }
}

export default LogCommand
