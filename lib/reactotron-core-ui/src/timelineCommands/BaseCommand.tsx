import React, { Component, FunctionComponent, ReactNode, useState } from "react"
import styled from "styled-components"

import TimelineCommand from "../components/TimelineCommand"

export interface TimelineCommandPropsEx<T> {
  command: {
    clientId?: string
    connectionId: number
    date: Date
    deltaTime: number
    important: boolean
    messageId: number
    payload: T
    type: string
  }
  copyToClipboard?: (text: string) => void
  readFile?: (path: string) => Promise<string>
  sendCommand?: (type: string, payload: any, clientId?: string) => void
  openDispatchDialog?: (action: string) => void
  dispatchAction?: (action: any) => void
}

export interface TimelineCommandProps<T> extends TimelineCommandPropsEx<T> {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Description = styled.div`
  color: ${(props) => props.theme.foreground};
  margin-bottom: 10px;
`

const ErrorLabel = styled.div`
  color: ${(props) => props.theme.foregroundDark};
  font-size: 12px;
  margin-bottom: 4px;
`

const ErrorDetail = styled.pre`
  font-size: 12px;
  color: ${(props) => props.theme.warning};
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  padding: 8px;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border-radius: 4px;
`

interface ErrorBoundaryProps {
  command: {
    type: string
    date: Date
    deltaTime: number
    payload: unknown
  }
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
  isOpen: boolean
}

class TimelineCommandErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, isOpen: false }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      let payloadPreview: string
      try {
        payloadPreview = JSON.stringify(this.props.command.payload, null, 2)
      } catch {
        payloadPreview = String(this.props.command.payload)
      }

      return (
        <TimelineCommand
          date={this.props.command.date}
          deltaTime={this.props.command.deltaTime}
          title="RENDER ERROR"
          preview={`Unexpected payload for ${this.props.command.type}`}
          isOpen={this.state.isOpen}
          setIsOpen={(isOpen) => this.setState({ isOpen })}
        >
          <Description>
            Reactotron received a <strong>{this.props.command.type}</strong> event
            with a payload it could not render.
          </Description>
          <ErrorLabel>Error</ErrorLabel>
          <ErrorDetail>{this.state.error.message}</ErrorDetail>
          <ErrorLabel style={{ marginTop: 10 }}>Payload</ErrorLabel>
          <ErrorDetail>{payloadPreview}</ErrorDetail>
        </TimelineCommand>
      )
    }
    return this.props.children
  }
}

export function buildTimelineCommand<T>(
  Component: FunctionComponent<TimelineCommandProps<T>>,
  startOpen = false
) {
  // eslint-disable-next-line react/display-name
  return (props: TimelineCommandPropsEx<T>) => {
    const [isOpen, setIsOpen] = useState(startOpen)

    return (
      <TimelineCommandErrorBoundary command={props.command}>
        <Component {...props} isOpen={isOpen} setIsOpen={setIsOpen} />
      </TimelineCommandErrorBoundary>
    )
  }
}
