import React from "react"
import { MdSwapVert as ExpandIcon } from "react-icons/md"
import { Pressable } from "react-native"
import styled from "rn-css"

import config from "../../config"
import {
  getPlatformName,
  getPlatformDetails,
  getConnectionName,
} from "../../util/connectionHelpers"
import { Connection, ServerStatus } from "../../contexts/Standalone/useStandalone"
import ConnectionSelector from "../ConnectionSelector"

const Container = styled.View`
  border-top: 1px solid ${(props) => props.theme.chromeLine};
  box-shadow: 0 0 30px ${(props) => props.theme.glow};
`

const ConnectionContainer = styled.View`
  flex: 1;
  height: 85px;
  overflow-x: auto;
`

interface ContentContainerProps {
  $isOpen: boolean
}
const ContentContainer = styled(Pressable)<ContentContainerProps>`
  align-items: center;
  background-color: ${(props) => props.theme.subtleLine};
  cursor: ${(props) => (props.$isOpen ? "auto" : "pointer")};
  flex-direction: row;
  height: ${(props) => (props.$isOpen ? "85px" : "25px")};
  justify-content: space-between;
  padding: 0 10px;
`

const ConnectionInfo = styled.Text`
  color: ${(props) => props.theme.foregroundLight};
  text-align: center;
`

const ExpandContainer = styled(Pressable)`
  align-items: center;
  color: ${(props) => props.theme.foregroundLight};
  cursor: pointer;
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
}

function Header({
  serverStatus,
  connections,
  selectedConnection,
  isOpen,
  setIsOpen,
  onChangeConnection,
}: Props) {
  const renderMethod = isOpen ? renderExpanded : renderCollapsed

  return (
    <Container>
      <ContentContainer onPress={() => !isOpen && setIsOpen(true)} $isOpen={isOpen}>
        {renderMethod(serverStatus, connections, selectedConnection, onChangeConnection)}
        <ExpandContainer onPress={() => setIsOpen(!isOpen)}>
          <ExpandIcon size={18} />
        </ExpandContainer>
      </ContentContainer>
    </Container>
  )
}

export default Header
