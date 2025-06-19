import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { MdSwapVert as ExpandIcon } from "react-icons/md"

import {
  getPlatformName,
  getPlatformDetails,
  getConnectionName,
} from "../../util/connectionHelpers"
import type { Connection, ServerStatus } from "../../contexts/Standalone/useStandalone"
import ConnectionSelector from "../ConnectionSelector"
import { store } from "../../util/store"

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

function renderExpanded(
  serverStatus: ServerStatus,
  connections: Connection[],
  selectedConnection: Connection | null,
  onChangeConnection: (clientId: string | null) => void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serverPort?: string
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
  selectedConnection: Connection | null,
  onChangeConnection: (clientId: string | null) => void,
  serverPort: string
) {
  return (
    <>
      <ConnectionInfo>
        port {serverPort} | {connections.length} connections
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
}

function Header({
  serverStatus,
  connections,
  selectedConnection,
  isOpen,
  setIsOpen,
  onChangeConnection,
}: Props) {
  const [serverPort, setServerPort] = useState("");

  useEffect(() => {
    store.get("serverPort").then((port) => {
      setServerPort(port as string);
    });
  }, []);
  const renderMethod = isOpen ? renderExpanded : renderCollapsed

  return (
    <Container>
      <ContentContainer onClick={() => !isOpen && setIsOpen(true)} $isOpen={isOpen}>
        {renderMethod(serverStatus, connections, selectedConnection, onChangeConnection, serverPort)}
        <ExpandContainer onClick={() => setIsOpen(!isOpen)}>
          <ExpandIcon size={18} />
        </ExpandContainer>
      </ContentContainer>
    </Container>
  )
}

export default Header
