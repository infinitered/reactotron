import React, { useContext, useMemo } from "react"
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
import Welcome from "./welcome"

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
  border-bottom: 1px solid ${(props) => props.theme.line};
`
const IconContainer = styled.div`
  color: ${(props) => props.theme.foregroundLight};
`
const PlatformName = styled.div`
  padding-left: 10px;
  color: ${(props) => props.theme.tag};
  width: 25%;
`
const PlatformDetails = styled.div`
  border-left: 1px solid ${(props) => props.theme.subtleLine};
  color: ${(props) => props.theme.foregroundDark};
  padding-left: 10px;
  margin-left: 10px;
`
const Screen = styled.div`
  border-left: 1px solid ${(props) => props.theme.subtleLine};
  color: ${(props) => props.theme.backgroundHighlight};
  padding-left: 10px;
  margin-left: 10px;
`

function ConnectionCell({ connection }: { connection: Connection }) {
  const [ConnectionIcon, platformName, platformDetails, screen] = useMemo(() => {
    return [
      getIcon(connection),
      getPlatformName(connection),
      getPlatformDetails(connection),
      getScreen(connection),
    ]
  }, [connection])

  return (
    <ConnectionContainer>
      <IconContainer>
        <ConnectionIcon size={32} />
      </IconContainer>
      <PlatformName>{platformName}</PlatformName>
      <PlatformDetails>{platformDetails}</PlatformDetails>
      <Screen>{screen}</Screen>
    </ConnectionContainer>
  )
}

function Connections() {
  const { connections } = useContext(StandaloneContext)

  return (
    <Container>
      <Header title="Connections" isDraggable />
      {connections.length > 0 ? (
        connections.map((connection) => (
          <ConnectionCell key={connection.clientId} connection={connection} />
        ))
      ) : (
        <Welcome />
      )}
    </Container>
  )
}

export default Connections
