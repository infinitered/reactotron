import React from "react"
import { MdSwapVert as ExpandIcon } from "react-icons/md"
import { Pressable } from "react-native"
import styled from "rn-css"

import config from "../../config"
import { Connection } from "../../contexts/Standalone/useStandalone"
import { getPlatformDetails, getPlatformName } from "../../util/connectionHelpers"
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

function renderDeviceName(connection: Connection) {
  return `${getPlatformName(connection)} ${getPlatformDetails(connection)}`
}

function renderExpanded(
  connections: Connection[],
  selectedConnection: Connection | null,
  onChangeConnection: (clientId: string | null) => void
) {
  const showName = connections && connections.some((c) => c.name !== connections[0].name)

  return (
    <ConnectionContainer>
      {connections.map((c) => (
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
        port {config.get("serverPort") as string} | {connections.length} connections
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
      <ContentContainer onPress={() => !isOpen && setIsOpen(true)} $isOpen={isOpen}>
        {renderMethod(connections, selectedConnection, onChangeConnection)}
        <ExpandContainer onPress={() => setIsOpen(!isOpen)}>
          <ExpandIcon size={18} />
        </ExpandContainer>
      </ContentContainer>
    </Container>
  )
}

export default Header
