import fs from "fs"
import { inject, observer } from "mobx-react"
import PropTypes from "prop-types"
import {
  always,
  is,
  isNil,
  join,
  keys,
  last,
  length,
  lt,
  map,
  max,
  merge,
  min,
  pickBy,
  replace,
  slice,
  split,
  take,
  takeLast,
  when,
} from "ramda"
import { dotPath, isNilOrEmpty } from "ramdasauce"
import React, { Component } from "react"
import ReactTooltip from "react-tooltip"
import stringifyObject from "stringify-object"
import Command from "../Shared/Command"
import Content from "../Shared/Content"
import AppStyles from "../Theme/AppStyles"
import Colors from "../Theme/Colors"

const PREVIEW_LENGTH = 500
const SOURCE_LINES_UP = 3
const SOURCE_LINES_DOWN = 3
const SOURCE_FILE_PATH_COUNT = 3
const OBJECT_KEYS_COUNT = 5
const OBJECT_PROPERTY_PREVIEW_LENGTH = 80

const getName = level => {
  switch (level) {
    case "debug":
      return "DEBUG"
    case "warn":
      return "WARNING"
    case "error":
      return "ERROR"
    default:
      return "LOG"
  }
}

const stackFrameBaseStyle = {
  ...AppStyles.Layout.hbox,
  padding: 6,
  wordBreak: "break-all",
  cursor: "pointer",
}

const selectionStyle = {
  color: Colors.tag,
  backgroundColor: Colors.backgroundDarker,
  borderLeft: `1px solid ${Colors.tag}`,
  borderRight: `1px solid ${Colors.subtleLine}`,
  borderTop: `1px solid ${Colors.subtleLine}`,
  borderBottom: `1px solid ${Colors.subtleLine}`,
}

const Styles = {
  container: {
    paddingTop: 4,
  },
  stack: {
    marginTop: 10,
    ...AppStyles.Layout.vbox,
  },
  stackTable: {
    ...AppStyles.Layout.vbox,
  },
  stackFrame: {
    ...stackFrameBaseStyle,
    ...AppStyles.Layout.hbox,
    padding: 6,
  },
  stackFrameNodeModule: {
    ...stackFrameBaseStyle,
    opacity: 0.4,
  },
  selectedStackFrame: {
    ...selectionStyle,
  },
  number: {
    color: Colors.constant,
    textAlign: "right",
    width: 50,
    paddingRight: 10,
    paddingTop: 3,
  },
  functionName: {
    flex: 1,
  },
  fileName: {
    flex: 1,
    wordBreak: "break-all",
  },
  lineNumber: {
    color: Colors.constant,
    wordBreak: "break-all",
    width: 50,
    textAlign: "right",
  },
  stackLabel: {
    color: Colors.foregroundDark,
    margin: "0 7px",
    wordBreak: "break-all",
  },
  stackTitle: {
    color: Colors.constant,
    paddingBottom: 10,
    wordBreak: "break-all",
  },
  theadRow: {
    ...AppStyles.Layout.hbox,
    padding: 6,
    color: Colors.foregroundDark,
  },
  headerFrame: {
    textAlign: "right",
    width: 60,
    paddingRight: 5,
  },
  headerFunction: {
    textAlign: "left",
    flex: 1,
  },
  headerFile: {
    flex: 1,
    textAlign: "left",
  },
  headerLineNumber: {
    textAlign: "right",
    width: 60,
  },
  errorMessage: {
    wordBreak: "break-all",
    marginBottom: 30,
    color: Colors.tag,
    paddingLeft: 10,
    paddingTop: 20,
    paddingBottom: 20,
    WebkitUserSelect: "text",
    cursor: "text",
    ...selectionStyle,
  },
  sourceFilename: {
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    color: Colors.tag,
    borderBottom: `1px solid ${Colors.line}`,
  },
  sourceCode: {
    ...AppStyles.Layout.vbox,
    paddingBottom: 10,
  },
  sourceLine: {
    ...AppStyles.Layout.hbox,
    paddingTop: 6,
    paddingBottom: 6,
    cursor: "pointer",
    color: Colors.foregroundDark,
  },
  sourceLineHighlight: {
    opacity: 1,
    ...selectionStyle,
  },
  sourceLineNumber: {
    width: 60,
    paddingRight: 15,
    color: Colors.constant,
    textAlign: "right",
  },
  sourceLineCode: {
    flex: 1,
    whiteSpace: "pre-wrap",
  },
}

@inject("session")
@observer
class LogCommand extends Component {
  static propTypes = {
    command: PropTypes.object.isRequired,
  }

  state = {
    lines: null,
    lineNumber: null,
  }

  constructor(props) {
    super(props)
    this.loadingSource = false
    this.renderStackFrame = this.renderStackFrame.bind(this)
    this.fetchLines = this.fetchLines.bind(this)
    this.renderSource = this.renderSource.bind(this)
    this.fetchLines()
  }

  fetchLines() {
    // prevent-reentry
    if (this.loadingSource) return
    if (!this.state) return
    this.loadingSource = true
    // fetch the top stack frame
    const frame = dotPath("props.command.payload.stack.0", this)
    // jet if we don't have it'
    if (isNilOrEmpty(frame)) return
    const { fileName, lineNumber } = frame
    if (isNilOrEmpty(fileName)) return
    const partialFileName = join("/", takeLast(SOURCE_FILE_PATH_COUNT, split("/", fileName)))

    // kick-off a file read async
    fs.readFile(fileName, "utf-8", (err, data) => {
      // die quietly for we have failed
      if (err) {
        return
      }
      if (data && is(String, data)) {
        try {
          let lines
          let lineCounter = 0
          const lineBreak = /\n/g
          const contents = split(lineBreak, data)

          // create a new structure of lines
          const sourceLines = map(line => {
            lineCounter = lineCounter + 1
            // i am sorry my tab-based brethern.
            const source = replace(/\t/, "  ", line)
            return {
              isSelected: lineCounter === lineNumber,
              lineNumber: lineCounter,
              source,
            }
          }, contents)

          // should just load it all?
          const showWholeFile = contents.length < SOURCE_LINES_UP + SOURCE_LINES_DOWN

          if (showWholeFile) {
            lines = sourceLines
          } else {
            const lo = max(0, lineNumber - SOURCE_LINES_UP - 1)
            const hi = min(contents.length - 1, lineNumber + SOURCE_LINES_UP)
            lines = slice(lo, hi, sourceLines)
          }

          // kick it back to React
          this.setState({ lines, lineNumber, fileName, partialFileName })
        } catch (e) {}
      }
    })
  }

  renderSource() {
    const { lines, fileName, partialFileName } = this.state
    if (isNilOrEmpty(lines)) return null
    const { ui } = this.props.session

    // render a line of code
    const renderLine = line => {
      const { lineNumber, source, isSelected } = line
      const key = `line-${lineNumber}`
      const style = isSelected
        ? merge(Styles.sourceLine, Styles.sourceLineHighlight)
        : Styles.sourceLine
      const onClickStackFrame = e => ui.openInEditor(fileName, lineNumber)

      return (
        <div style={style} key={key} onClick={onClickStackFrame}>
          <div style={Styles.sourceLineNumber}>{lineNumber}</div>
          <div style={Styles.sourceLineCode}>{source}</div>
        </div>
      )
    }

    return (
      <div style={Styles.sourceCode}>
        <div style={Styles.sourceFilename}>{partialFileName}</div>
        {map(renderLine, lines)}
      </div>
    )
  }

  renderStackFrame(stackFrame, number) {
    const { session } = this.props
    const { ui } = session
    const key = `stack-${number}`

    // grab the stack frame details and fallback to something sane
    let fileName = stackFrame.fileName || ""
    let functionName = stackFrame.functionName || ""
    let lineNumber = stackFrame.lineNumber || 0

    const justTheFile = last(split("/", fileName))
    fileName = fileName && replace("webpack://", "", fileName)
    functionName = functionName && replace("webpack://", "", functionName)
    const isNodeModule = fileName.indexOf("/node_modules/") >= 0
    const onClickStackFrame =
      fileName === "" ? () => true : e => ui.openInEditor(fileName, lineNumber)
    const isSelected = number === 1

    let style = isNodeModule ? Styles.stackFrameNodeModule : Styles.stackFrame
    if (isSelected) {
      style = merge(style, Styles.selectedStackFrame)
    }
    const tooltip = fileName
    return (
      <div key={key} style={style} onClick={onClickStackFrame}>
        <div style={Styles.functionName}>{functionName || "(anonymous function)"}</div>
        <div style={Styles.fileName} data-tip={tooltip}>
          {justTheFile}
          <ReactTooltip place="bottom" class="tooltipThemeReducedWidth" />
        </div>
        <div style={Styles.lineNumber}>{lineNumber}</div>
      </div>
    )
  }

  renderStack(stack) {
    this.fetchLines()

    let i = 0
    return (
      <div style={Styles.stack}>
        <div style={Styles.sourceFilename}>Stack Trace</div>
        <div style={Styles.stackTable}>
          <div style={Styles.theadRow}>
            <div style={Styles.headerFunction}>Function</div>
            <div style={Styles.headerFile}>File</div>
            <div style={Styles.headerLineNumber}>line</div>
          </div>
          {map(stackFrame => {
            i++
            return this.renderStackFrame(stackFrame, i)
          }, stack)}
        </div>
      </div>
    )
  }

  getPreview(message) {
    if (is(String, message)) {
      return take(PREVIEW_LENGTH, message)
    } else if (is(Object, message)) {
      const moreKeys = lt(OBJECT_KEYS_COUNT, length(keys(message)))
      let i = 0
      const previewMessage = moreKeys ? pickBy(() => i++ < OBJECT_KEYS_COUNT, message) : message

      const preview = stringifyObject(previewMessage, {
        transform: (obj, prop, originalResult) => {
          if (is(Object, obj[prop])) {
            return "{...}"
          } else {
            return take(OBJECT_PROPERTY_PREVIEW_LENGTH, originalResult)
          }
        },
      })

      return when(always(moreKeys), replace(/\s\}$/i, ", ...}"))(preview)
    } else if (isNil(message) || is(Boolean, message) || is(Number, message)) {
      return String(message)
    }
    return null
  }

  render() {
    const { command } = this.props
    const { payload } = command
    const { level } = payload
    const { message, stack } = payload
    const title = getName(level)
    const containerTypes = merge(Styles.container, {
      color: level === "debug" ? Colors.foreground : Colors.foreground,
    })
    const hasLines = !!this.state.lines

    let preview = this.getPreview(message)

    return (
      <Command {...this.props} title={title} preview={preview}>
        <div style={containerTypes}>
          {!stack && <Content value={message} />}
          {stack && <div style={Styles.errorMessage}>{message}</div>}
          {stack && hasLines && this.renderSource()}
          {stack && this.renderStack(stack)}
        </div>
      </Command>
    )
  }
}

export default LogCommand
