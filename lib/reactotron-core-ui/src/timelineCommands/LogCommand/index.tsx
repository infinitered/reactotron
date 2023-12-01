import React, { FunctionComponent, useEffect, useState } from "react"
import styled from "styled-components"
import { MdContentCopy } from "react-icons/md"
import stringifyObject from "stringify-object"

import TimelineCommand from "../../components/TimelineCommand"
import ContentView from "../../components/ContentView"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"
import { isErrorStackFrameArray } from "reactotron-core-contract"
import type { ErrorStackFrame, LogPayload } from "reactotron-core-contract"

const SOURCE_LINES_UP = 3
const SOURCE_LINES_DOWN = 3
const SOURCE_FILE_PATH_COUNT = 3

const ErrorMessage = styled.div`
  word-break: break-all;
  margin-bottom: 30px;
  padding: 20px 0 20px 10px;
  cursor: text;
  user-select: text;
  color: ${(props) => props.theme.tag};
  background-color: ${(props) => props.theme.backgroundDarker};
  border-left: 1px solid ${(props) => props.theme.tag};
  border-right: 1px solid ${(props) => props.theme.subtleLine};
  border-top: 1px solid ${(props) => props.theme.subtleLine};
  border-bottom: 1px solid ${(props) => props.theme.subtleLine};
`

const SourceContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  color: ${(props) => props.theme.foreground};
`
const SourceFilename = styled.div`
  padding: 5px 0;
  margin-bottom: 5px;
  color: ${(props) => props.theme.tag};
`
interface SourceLineContainerProps {
  $isSelected: boolean
}
const SourceLineContainer = styled.div.attrs(() => ({}))<SourceLineContainerProps>`
  display: flex;
  padding: 6px 0;
  cursor: pointer;
  color: ${(props) => (props.$isSelected ? props.theme.tag : props.theme.foregroundDark)};
  background-color: ${(props) =>
    props.$isSelected ? props.theme.backgroundDarker : "transparent"};
  border-left: ${(props) => (props.$isSelected ? `1px solid ${props.theme.tag}` : undefined)};
  border-right: ${(props) =>
    props.$isSelected ? `1px solid ${props.theme.subtleLine}` : undefined};
  border-top: ${(props) => (props.$isSelected ? `1px solid ${props.theme.subtleLine}` : undefined)};
  border-bottom: ${(props) =>
    props.$isSelected ? `1px solid ${props.theme.subtleLine}` : undefined};
`
const SourceLineNumber = styled.div`
  width: 60px;
  padding-right: 15px;
  color: ${(props) => props.theme.constant};
  text-align: right;
`
const SourceLineCode = styled.div`
  flex: 1;
  white-space: pre-wrap;
`

const StackContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`
const StackTitle = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  margin-bottom: 5px;
  color: ${(props) => props.theme.tag};
  border-bottom: 1px solid ${(props) => props.theme.line};
`
const StackTable = styled.div`
  display: flex;
  flex-direction: column;
`
const StackTableHeadRow = styled.div`
  display: flex;
  padding: 6px;
  color: ${(props) => props.theme.foregroundDark};
`
const StackTableHeaderFunction = styled.div`
  text-align: left;
  flex: 1;
`
const StackTableHeaderLineNumber = styled.div`
  text-align: right;
  width: 60px;
`

interface StackFrameContainerProps {
  $isNodeModule: boolean
  $isSelected: boolean
}
const StackFrameContainer = styled.div.attrs(() => ({}))<StackFrameContainerProps>`
  display: flex;
  padding: 6px;
  word-break: break-all;
  /* cursor: pointer; */
  opacity: ${(props) => (props.$isNodeModule ? 0.4 : 1)};
  cursor: pointer;

  color: ${(props) => (props.$isSelected ? props.theme.tag : props.theme.foreground)};
  background-color: ${(props) =>
    props.$isSelected ? props.theme.backgroundDarker : "transparent"};
  border-left: ${(props) => (props.$isSelected ? `1px solid ${props.theme.tag}` : undefined)};
  border-right: ${(props) =>
    props.$isSelected ? `1px solid ${props.theme.subtleLine}` : undefined};
  border-top: ${(props) => (props.$isSelected ? `1px solid ${props.theme.subtleLine}` : undefined)};
  border-bottom: ${(props) =>
    props.$isSelected ? `1px solid ${props.theme.subtleLine}` : undefined};
`
const StackFrameFunction = styled.div`
  flex: 1;
`
const StackFrameFile = styled.div`
  flex: 1;
  word-break: break-all;
`
const StackFrameLineNumber = styled.div`
  color: ${(props) => props.theme.constant};
  word-break: break-all;
  width: 50px;
  text-align: right;
`

interface Props extends TimelineCommandProps<LogPayload> {}

function buildToolbar(commandPayload, copyToClipboard: (text: string) => void) {
  if (!copyToClipboard) return []

  return [
    {
      icon: MdContentCopy,
      onClick: () => {
        const { level, stack, message } = commandPayload

        if (!message) return

        if (level === "error" && stack) {
          copyToClipboard(JSON.stringify({ message, stack }, null, 2))
        } else if (typeof message === "string") {
          copyToClipboard(message)
        } else if (typeof message === "object") {
          const text = JSON.stringify(message, null, 2)
          copyToClipboard(text)
        }
      },
      tip: "Copy text to clipboard",
    },
  ]
}

function getLevelName(level: string) {
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

// function getPreview(message: string | object | boolean | number) {
function getPreview(message: any) {
  if (typeof message === "string") {
    return message.substr(0, 500)
  } else if (typeof message === "object") {
    const firstValues = {}

    Object.keys(message)
      .slice(0, 5)
      .forEach((key) => (firstValues[key] = message[key]))

    const preview = stringifyObject(firstValues, {
      transform: (obj, prop, originalResult) => {
        const objType = typeof obj[prop]

        if (objType === "object") {
          return "{...}"
        } else if (objType === "string") {
          return originalResult.substr(0, 80)
        } else {
          return originalResult
        }
      },
    })

    return Object.keys(message).length > Object.keys(firstValues).length
      ? preview.replace(/\s\}$/i, ", ...}")
      : preview
  } else if (message === null || typeof message === "boolean" || typeof message === "number") {
    return String(message)
  }

  return message
}

function useFileSource(stack: LogPayload, readFile: (path: string) => Promise<string>) {
  const [sourceCode, setSourceCode] = useState<{
    lines: {
      isSelected: boolean
      lineNumber: number
      source: string
    }[]
    lineNumber: number
    fileName: string
    partialFilename: string
  }>(null)

  useEffect(() => {
    if (!readFile) return
    if (!stack) return
    if (stack.level !== "error") return
    if (!stack.stack) return
    if (!stack.stack) return
    if (stack.stack.length === 0) return
    if (typeof stack.stack[0] === "string") return

    const { fileName, lineNumber } = stack.stack[0]
    if (!fileName) return

    const partialFilename = fileName
      .split("/")
      .slice(-1 * SOURCE_FILE_PATH_COUNT)
      .join("/")

    readFile(fileName)
      .then((source) => {
        if (!source || typeof source !== "string") return

        try {
          let lines
          let lineCounter = 0

          const contents = source.split(/\n/g)

          const sourceLines = contents.map((line) => {
            lineCounter = lineCounter + 1

            // Normalize indentation
            const normalizedLine = line.replace(/\t/g, "  ")

            return {
              isSelected: lineCounter === lineNumber,
              lineNumber: lineCounter,
              source: normalizedLine,
            }
          })

          const showWholeFile = contents.length < SOURCE_LINES_UP + SOURCE_LINES_DOWN

          if (showWholeFile) {
            lines = sourceLines
          } else {
            const low = Math.max(0, lineNumber - SOURCE_LINES_UP - 1)
            const high = Math.min(contents.length - 1, lineNumber + SOURCE_LINES_DOWN)
            lines = sourceLines.slice(low, high)
          }

          setSourceCode({
            lines,
            lineNumber,
            fileName,
            partialFilename,
          })
        } catch {}
      })
      .catch(() => {
        // Do nothing?
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return sourceCode
}

function renderStackFrame(
  stackFrame: ErrorStackFrame,
  idx: number,
  openInEditor: (file: string, lineNumber: number) => void
) {
  let fileName = stackFrame?.fileName || ""
  let functionName = stackFrame.functionName || ""
  const lineNumber = stackFrame.lineNumber || 0

  const fileNameLastSlash = fileName.lastIndexOf("/") + 1
  const justTheFile = fileNameLastSlash > -1 ? fileName.substr(fileNameLastSlash) : fileName

  fileName = fileName && fileName.replace("webpack://", "")
  functionName = functionName && functionName.replace("webpack://", "")

  const isNodeModule = fileName.indexOf("/node_modules/") > -1
  const isSelected = idx === 0

  return (
    <StackFrameContainer
      key={`stack-${idx}`}
      $isNodeModule={isNodeModule}
      $isSelected={isSelected}
      onClick={() => {
        openInEditor(fileName, lineNumber)
      }}
    >
      <StackFrameFunction>{functionName || "(anonymous function)"}</StackFrameFunction>
      <StackFrameFile>{justTheFile}</StackFrameFile>
      <StackFrameLineNumber>{lineNumber}</StackFrameLineNumber>
    </StackFrameContainer>
  )
}

const LogCommand: FunctionComponent<Props> = ({
  command,
  isOpen,
  setIsOpen,
  copyToClipboard,
  readFile,
  sendCommand,
}) => {
  const { payload, date, deltaTime, important } = command

  const openInEditor = (file: string, lineNumber: number) => {
    if (file === "") return

    sendCommand("editor.open", {
      file,
      lineNumber,
    })
  }

  const source = useFileSource(payload, readFile)
  const toolbar = buildToolbar(payload, copyToClipboard)

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title={getLevelName(payload.level)}
      preview={getPreview(payload.message)}
      toolbar={toolbar}
      isImportant={important}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {"stack" in payload === false && <ContentView value={payload.message} />}
      {"stack" in payload && (
        <>
          <ErrorMessage>{payload.message}</ErrorMessage>
          {source && (
            <SourceContainer>
              <SourceFilename>{source.partialFilename}</SourceFilename>
              {source.lines.map((line) => {
                return (
                  <SourceLineContainer
                    key={`${line.source}-${line.lineNumber}`}
                    $isSelected={line.isSelected}
                    onClick={() => {
                      openInEditor(source.fileName, source.lineNumber)
                    }}
                  >
                    <SourceLineNumber>{line.lineNumber}</SourceLineNumber>
                    <SourceLineCode>{line.source}</SourceLineCode>
                  </SourceLineContainer>
                )
              })}
            </SourceContainer>
          )}
          <StackContainer>
            <StackTitle>Stack Trace</StackTitle>
            <StackTable>
              <StackTableHeadRow>
                <StackTableHeaderFunction>Function</StackTableHeaderFunction>
                <StackTableHeaderFunction>File</StackTableHeaderFunction>
                <StackTableHeaderLineNumber>Line</StackTableHeaderLineNumber>
              </StackTableHeadRow>
              {isErrorStackFrameArray(payload.stack)
                ? payload.stack.map((stackFrame, idx) =>
                    renderStackFrame(stackFrame, idx, openInEditor)
                  )
                : null}
            </StackTable>
          </StackContainer>
        </>
      )}
    </TimelineCommand>
  )
}

export default buildTimelineCommand(LogCommand)
export { LogCommand }
