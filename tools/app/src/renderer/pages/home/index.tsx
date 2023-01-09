import React, { useContext } from "react"
import { Header } from "reactotron-core-ui"
import styled from "styled-components"

import StandaloneContext from "../../contexts/Standalone"
import {
  getPlatformName,
  getPlatformDetails,
  getScreen,
  getIcon,
} from "../../util/connectionHelpers"
import { Connection } from "../../contexts/Standalone/useStandalone"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ConnectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${props => props.theme.line};
`
const IconContainer = styled.div`
  color: ${props => props.theme.foregroundLight};
`
const PlatformName = styled.div`
  padding-left: 10px;
  color: ${props => props.theme.tag};
  width: 25%;
`
const PlatformDetails = styled.div`
  border-left: 1px solid ${props => props.theme.subtleLine};
  color: ${props => props.theme.foregroundDark};
  padding-left: 10px;
  margin-left: 10px;
`
const Screen = styled.div`
  border-left: 1px solid ${props => props.theme.subtleLine};
  color: ${props => props.theme.backgroundHighlight};
  padding-left: 10px;
  margin-left: 10px;
`

function ConnectionCell({ connection }: { connection: Connection }) {
  const ConnectionIcon = getIcon(connection)

  return (
    <ConnectionContainer>
      <IconContainer>
        <ConnectionIcon size={32} />
      </IconContainer>
      <PlatformName>{getPlatformName(connection)}</PlatformName>
      <PlatformDetails>{getPlatformDetails(connection)}</PlatformDetails>
      <Screen>{getScreen(connection)}</Screen>
    </ConnectionContainer>
  )
}

function Connections() {
  const { connections } = useContext(StandaloneContext)

  return (
    <Container>
      <Header title="Connections" isDraggable />
      {connections.map(connection => (
        <ConnectionCell key={connection.clientId} connection={connection} />
      ))}
    </Container>
  )
}

export default Connections
