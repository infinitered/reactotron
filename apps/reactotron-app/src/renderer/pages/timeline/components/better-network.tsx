import React, { useEffect, useState } from "react"
import Styles from "./drawer.styles"
import { ContentView } from "reactotron-core-ui"
import { useDrawerResize } from "./useDrawerResize"
import { VirtualizedList } from "./virtualized-list"

export interface Command {
  clientId?: string
  connectionId: number
  date: Date
  deltaTime: number
  important: boolean
  messageId: number
  payload: any
  type: string
}

interface Props {
  commands: Command[]
}

const {
  SDrawer,
  RequestContainer,
  RequestResponseContainer,
  RequestItem,
  RequestDataHeader,
  RequestResponseContainerBody,
  ResizeHandle,
  RequestMethodStatus,
  HttpMethod,
  StatusCode,
  StatusSeparator,
} = Styles

const AvailableTabs = [
  "request headers",
  "request params",
  "request body",
  "response headers",
  "response",
] as const

export const BetterNetwork = ({ commands }: Props) => {
  const filteredCommands = commands.filter((command) => command.type === "api.response")

  const [currentCommandId, setCurrentCommandId] = useState<number>()
  const [currSelectedType, setCurrSelectedType] = useState<string>("request headers")

  const { containerRef, leftPanelWidth, handleMouseDown } = useDrawerResize({
    initialLeftPanelWidth: 350,
    minLeftPanelWidth: 200,
    minRightPanelWidth: 200,
    resizeHandleWidth: 10,
  })

  useEffect(() => {
    if (!currentCommandId && !!commands.length) {
      setCurrentCommandId(commands[0].messageId)
    }
  }, [commands, commands.length, currentCommandId])

  const currentCommand = filteredCommands.find((command) => command.messageId === currentCommandId)

  const tabResolver = (tab: string) => {
    switch (tab) {
      case "response":
        return currentCommand?.payload?.response?.body
      case "response headers":
        return currentCommand?.payload?.response?.headers
      case "request headers":
        return currentCommand?.payload?.request?.headers
      case "request params":
        return currentCommand?.payload?.request?.params
      case "request body":
        return currentCommand?.payload?.request?.data
    }
  }

  return (
    <SDrawer ref={containerRef} style={{ gridTemplateColumns: `${leftPanelWidth}px 1fr` }}>
      <RequestContainer>
        {containerRef.current && (
          <VirtualizedList
            getKey={(item) => item.messageId.toString()}
            data={filteredCommands}
            itemHeight={50}
            height={containerRef.current?.offsetHeight}
            renderItem={(command) => {
              return (
                <RequestItem
                  key={command?.messageId}
                  onClick={() => setCurrentCommandId(command?.messageId)}
                  className={currentCommandId === command?.messageId ? "active" : ""}
                >
                  <p>{command.payload?.request?.url}</p>
                </RequestItem>
              )
            }}
          />
        )}
      </RequestContainer>
      <RequestResponseContainer>
        <ResizeHandle onMouseDown={handleMouseDown} />
        <RequestDataHeader>
          <RequestMethodStatus>
            <HttpMethod method={currentCommand?.payload?.request?.method}>
              {currentCommand?.payload?.request?.method?.toUpperCase() || "N/A"}
            </HttpMethod>
            <StatusSeparator>•</StatusSeparator>
            <StatusCode status={currentCommand?.payload?.response?.status}>
              {currentCommand?.payload?.response?.status || "N/A"}
            </StatusCode>
          </RequestMethodStatus>
          {AvailableTabs.map((tab) => {
            const hasTab = tabResolver(tab)
            if (!hasTab) return null

            return (
              <li
                key={tab}
                onClick={() => setCurrSelectedType(tab)}
                className={currSelectedType === tab ? "active" : ""}
              >
                {tab}
              </li>
            )
          })}
        </RequestDataHeader>
        {currentCommandId && (
          <RequestResponseContainerBody key={currentCommandId}>
            <ContentView value={tabResolver(currSelectedType)} />
          </RequestResponseContainerBody>
        )}
      </RequestResponseContainer>
    </SDrawer>
  )
}
