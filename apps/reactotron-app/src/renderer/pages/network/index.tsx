import React, { useContext, useEffect, useState } from "react"
import Styles from "./network.styles"
import { ContentView, ReactotronContext, Header, EmptyState } from "reactotron-core-ui"
import { MdNetworkCheck } from "react-icons/md"
import { useDrawerResize } from "./useDrawerResize"
import { NetworkRequestsList } from "./components/NetworkRequestsList"
import { NetworkRequestHeader } from "./components/NetworkRequestHeader"

const {
  Container,
  SDrawer,
  RequestResponseContainer,
  RequestResponseContainerBody,
  ResizeHandle,
} = Styles

export const Network = () => {
  const { commands } = useContext(ReactotronContext)
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

  if (filteredCommands.length === 0) {
    return (
      <Container>
        <Header title="Network" isDraggable />
        <EmptyState icon={MdNetworkCheck} title="No Network Activity">
          <p>Network requests will appear here once your app starts making API calls.</p>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      <Header title="Network" isDraggable actions={[]}/>
      <SDrawer ref={containerRef} style={{ gridTemplateColumns: `${leftPanelWidth}px 1fr` }}>
        {containerRef.current && (
          <NetworkRequestsList
            filteredCommands={filteredCommands}
            containerHeight={containerRef.current?.offsetHeight}
            currentCommandId={currentCommandId}
            onRequestClick={setCurrentCommandId}
          />
        )}
        <RequestResponseContainer>
          <ResizeHandle onMouseDown={handleMouseDown} />
          <NetworkRequestHeader
            currentCommand={currentCommand}
            currSelectedType={currSelectedType}
            onTabChange={setCurrSelectedType}
            tabResolver={tabResolver}
          />
          {currentCommandId && (
            <RequestResponseContainerBody key={currentCommandId}>
              <ContentView value={tabResolver(currSelectedType)} />
            </RequestResponseContainerBody>
          )}
        </RequestResponseContainer>
      </SDrawer>
    </Container>
  )
}

