import React from "react"
import styled from "styled-components"
import { MdSwapVert as ExpandIcon } from "react-icons/md"

import config from "../../config"
import { Connection } from "../../contexts/Standalone/manager"
import { getPlatformName, getPlatformDetails } from "../../util/connectionHelpers"
import ConnectionSelector from "../ConnectionSelector"

const Container = styled.div`
  border-top: 1px solid ${props => props.theme.chromeLine};
  color: ${props => props.theme.foregroundDark};
  box-shadow: 0 0 30px ${props => props.theme.glow};
  color: ${props => props.theme.foregroundLight};
`

const ConnectionContainer = styled.div`
  display: flex;
  flex: 1;
  overflow-x: auto;
  height: 85px;
`

interface ContentContainerProps {
  isOpen: boolean
}
const ContentContainer = styled.div<ContentContainerProps>`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.subtleLine};
  padding: 0 10px;
  justify-content: space-between;
  align-items: center;
  cursor: ${props => (props.isOpen ? "auto" : "pointer")};
  height: ${props => (props.isOpen ? "85px" : "25px")};
`

const ConnectionInfo = styled.div`
  text-align: center;
`

const ExpandContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

function renderDeviceName(connection: Connection) {
  return `${getPlatformName(connection)} ${getPlatformDetails(connection)}`
}

function renderExpanded(
  connections: Connection[],
  selectedConnection: Connection | null,
  onChangeConnection: (clientId: string | null) => void
) {
  const showName = connections && connections.some(c => c.name !== connections[0].name)

  return (
    <ConnectionContainer>
      {connections.map(c => (
        <ConnectionSelector
          key={c.id}
          selectedConnection={selectedConnection}
          connection={c}
          showName={showName}
          onClick={() => onChangeConnection(c.clientId)}
        />
      ))}
    </ConnectionContainer>
  )
}

function renderCollapsed(connections: Connection[], selectedConnection: Connection | null) {
  return (
    <>
      <ConnectionInfo>
        port {config.get("server.port")} | {connections.length} connections
      </ConnectionInfo>
      <ConnectionInfo>
        device:{" "}
        {selectedConnection ? renderDeviceName(selectedConnection) : "Waiting for connection"}
      </ConnectionInfo>
    </>
  )
}

interface Props {
  connections: Connection[]
  selectedConnection: Connection | null
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onChangeConnection: (clientId: string | null) => void
}

function Header({ connections, selectedConnection, isOpen, setIsOpen, onChangeConnection }: Props) {
  const renderMethod = isOpen ? renderExpanded : renderCollapsed

  return (
    <Container>
      <ContentContainer onClick={() => !isOpen && setIsOpen(true)} isOpen={isOpen}>
        {renderMethod(connections, selectedConnection, onChangeConnection)}
        <ExpandContainer onClick={() => setIsOpen(!isOpen)}>
          <ExpandIcon size={18} />
        </ExpandContainer>
      </ContentContainer>
    </Container>
  )
}

export default Header
