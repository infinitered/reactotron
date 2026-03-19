import React from "react"
import styled from "styled-components"
import { MdSwapVert as ExpandIcon } from "react-icons/md"

import config from "../../config"
import {
  getPlatformName,
  getPlatformDetails,
  getConnectionName,
} from "../../util/connectionHelpers"
import { Connection, ServerStatus } from "../../contexts/Standalone/useStandalone"
import { McpStatus } from "../../contexts/Standalone"
import ConnectionSelector from "../ConnectionSelector"

const Container = styled.div`
  border-top: 1px solid ${(props) => props.theme.chromeLine};
  color: ${(props) => props.theme.foregroundDark};
  box-shadow: 0 0 30px ${(props) => props.theme.glow};
  color: ${(props) => props.theme.foregroundLight};
`

const ConnectionContainer = styled.div`
  display: flex;
  flex: 1;
  overflow-x: auto;
  height: 85px;
`

interface ContentContainerProps {
  $isOpen: boolean
}
const ContentContainer = styled.div.attrs(() => ({}))<ContentContainerProps>`
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.subtleLine};
  padding: 0 10px;
  justify-content: space-between;
  align-items: center;
  cursor: ${(props) => (props.$isOpen ? "auto" : "pointer")};
  height: ${(props) => (props.$isOpen ? "85px" : "25px")};
`

const ConnectionInfo = styled.div`
  text-align: center;
`

const ExpandContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

interface McpButtonProps {
  $active: boolean
}

const McpButton = styled.div.attrs(() => ({}))<McpButtonProps>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  user-select: none;
  background-color: ${(props) => props.$active ? "rgba(80, 200, 120, 0.15)" : "transparent"};
  border: 1px solid ${(props) => props.$active ? "rgba(80, 200, 120, 0.4)" : props.theme.chromeLine};
  color: ${(props) => props.$active ? "#50c878" : props.theme.foregroundDark};
  &:hover {
    background-color: ${(props) => props.$active ? "rgba(80, 200, 120, 0.25)" : "rgba(255,255,255,0.05)"};
  }
`

const McpDot = styled.div<McpButtonProps>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => props.$active ? "#50c878" : props.theme.foregroundDark};
`

function renderExpanded(
  serverStatus: ServerStatus,
  connections: Connection[],
  selectedConnection: Connection | null,
  onChangeConnection: (clientId: string | null) => void
) {
  return (
    <ConnectionContainer>
      {connections.map((c) => (
        <ConnectionSelector
          key={c.id}
          selectedConnection={selectedConnection}
          connection={c}
          onClick={() => onChangeConnection(c.clientId)}
        />
      ))}
    </ConnectionContainer>
  )
}

function renderConnectionInfo(selectedConnection) {
  return selectedConnection
    ? `${getConnectionName(selectedConnection)} | ${getPlatformName(
        selectedConnection
      )} ${getPlatformDetails(selectedConnection)}`
    : "Waiting for connection"
}

function renderCollapsed(
  serverStatus: ServerStatus,
  connections: Connection[],
  selectedConnection: Connection | null
) {
  return (
    <>
      <ConnectionInfo>
        port {config.get("serverPort")} | {connections.length} connections
      </ConnectionInfo>
      {serverStatus === "portUnavailable" && (
        <ConnectionInfo>Port 9090 unavailable.</ConnectionInfo>
      )}
      {serverStatus === "started" && (
        <ConnectionInfo>{renderConnectionInfo(selectedConnection)}</ConnectionInfo>
      )}
      {serverStatus === "stopped" && <ConnectionInfo>Waiting for server to start</ConnectionInfo>}
    </>
  )
}

interface Props {
  serverStatus: ServerStatus
  connections: Connection[]
  selectedConnection: Connection | null
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onChangeConnection: (clientId: string | null) => void
  mcpStatus: McpStatus
  mcpPort: number | null
  onToggleMcp: () => void
}

function Header({
  serverStatus,
  connections,
  selectedConnection,
  isOpen,
  setIsOpen,
  onChangeConnection,
  mcpStatus,
  mcpPort,
  onToggleMcp,
}: Props) {
  const renderMethod = isOpen ? renderExpanded : renderCollapsed

  return (
    <Container>
      <ContentContainer onClick={() => !isOpen && setIsOpen(true)} $isOpen={isOpen}>
        {renderMethod(serverStatus, connections, selectedConnection, onChangeConnection)}
        <McpButton
          $active={mcpStatus === "started"}
          onClick={(e) => { e.stopPropagation(); onToggleMcp() }}
          title={mcpStatus === "started" ? `MCP running on port ${mcpPort}` : "Start MCP server"}
        >
          <McpDot $active={mcpStatus === "started"} />
          {mcpStatus === "started" ? `MCP :${mcpPort}` : "MCP"}
        </McpButton>
        <ExpandContainer onClick={() => setIsOpen(!isOpen)}>
          <ExpandIcon size={18} />
        </ExpandContainer>
      </ContentContainer>
    </Container>
  )
}

export default Header
