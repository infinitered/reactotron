import React, { useContext, useEffect, useRef, useState } from "react"
import Styles from "./network.styles"
import { ContentView, ReactotronContext, Header, EmptyState } from "reactotron-core-ui"
import { MdNetworkCheck } from "react-icons/md"
import { useDrawerResize } from "./useDrawerResize"
import { NetworkRequestsList } from "./components/NetworkRequestsList"
import { NetworkRequestHeader } from "./components/NetworkRequestHeader"

const {
  Container,
  ResizableSectionWrapper,
  RequestResponseContainer,
  RequestResponseContainerBody,
  ResizeHandle,
} = Styles

export const Network = () => {
  const hasUserResizedRef = useRef(false)
  const resizeTimeoutRef = useRef<NodeJS.Timeout>()

  const { commands } = useContext(ReactotronContext)

  const [currentCommandId, setCurrentCommandId] = useState<number>()
  const [currSelectedType, setCurrSelectedType] = useState<string>("request headers")
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  const filteredCommands = commands.filter((command) => command.type === "api.response")

  useEffect(() => {
    const handleResize = () => {
      if (hasUserResizedRef.current) return
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)

      resizeTimeoutRef.current = setTimeout(() => {
        setScreenWidth(window.innerWidth)
      }, 150)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [])

  const initialLeftPanelWidth = Math.floor((screenWidth * 7) / 12)
  const minRightPanelWidth = Math.floor(screenWidth / 12)

  const { containerRef, leftPanelWidth, handleMouseDown } = useDrawerResize({
    initialLeftPanelWidth,
    minLeftPanelWidth: 400,
    minRightPanelWidth,
    resizeHandleWidth: 10,
    onUserResize: () => {
      hasUserResizedRef.current = true
    },
  })

  useEffect(() => {
    if (!currentCommandId && filteredCommands.length > 0) {
      setCurrentCommandId(filteredCommands[0].messageId)
    }
  }, [currentCommandId, filteredCommands])

  const currentCommand = filteredCommands.find((command) => command.messageId === currentCommandId)

  const tabContent = {
    "request headers": currentCommand?.payload?.request?.headers,
    "request params": currentCommand?.payload?.request?.params,
    "request body": currentCommand?.payload?.request?.data,
    "response body": currentCommand?.payload?.response?.body,
    "response headers": currentCommand?.payload?.response?.headers,
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
      <Header title="Network" isDraggable actions={[]} />
      <ResizableSectionWrapper
        ref={containerRef}
        style={{ gridTemplateColumns: `${leftPanelWidth}px 1fr` }}
      >
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
            currSelectedType={currSelectedType}
            onTabChange={setCurrSelectedType}
            tabContent={tabContent}
          />
          {currentCommandId && (
            <RequestResponseContainerBody key={currentCommandId}>
              <ContentView value={tabContent[currSelectedType]} />
            </RequestResponseContainerBody>
          )}
        </RequestResponseContainer>
      </ResizableSectionWrapper>
    </Container>
  )
}
