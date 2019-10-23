import React, { FunctionComponent, useState } from "react"

export interface TimelineCommandProps<T> {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  command: {
    clientId: string
    connectionId: number
    date: Date
    deltaTime: number
    important: boolean
    messageId: number
    payload: T
    type: string
  }
  copyToClipboard: (text: string) => void
}

export function buildTimelineCommand<T>(Component: FunctionComponent<TimelineCommandProps<T>>) {
  return (props: TimelineCommandProps<T>) => {
    const [isOpen, setIsOpen] = useState(false)

    return <Component {...props} isOpen={isOpen} setIsOpen={setIsOpen} />
  }
}
