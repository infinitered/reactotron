import React, { FunctionComponent, useState } from "react"

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

export function buildTimelineCommand<T>(
  Component: FunctionComponent<TimelineCommandProps<T>>,
  startOpen = false
) {
  // eslint-disable-next-line react/display-name
  return (props: TimelineCommandPropsEx<T>) => {
    const [isOpen, setIsOpen] = useState(startOpen)

    return <Component {...props} isOpen={isOpen} setIsOpen={setIsOpen} />
  }
}
