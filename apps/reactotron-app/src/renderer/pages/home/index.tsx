import React, { useContext, useMemo } from "react"
import { Header } from "reactotron-core-ui"
import styled from "styled-components"

import StandaloneContext from "../../contexts/Standalone"
import {
  getPlatformName,
  getPlatformDetails,
  getScreen,
  getIcon,
  getConnectionName,
} from "../../util/connectionHelpers"
import { ReactotronContext } from "reactotron-core-ui"
import { Connection } from "../../contexts/Standalone/useStandalone"
import Welcome from "./welcome"
import AndroidDeviceHelp from "../help/components/AndroidDeviceHelp"
import { MdOutlet, MdDeleteSweep } from "react-icons/md"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: scroll;
`

const ConnectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px 10px 20px;
  border-bottom: 1px solid ${(props) => props.theme.line};
`
const IconContainer = styled.div`
  color: ${(props) => props.theme.foregroundLight};
`
const AppName = styled.div`
  padding-left: 10px;
  color: ${(props) => props.theme.tag};

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
const ActionsContainer = styled.div`
`
const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 25%;
  align-items: center;
`
const MiddleContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const ConnectionDisconnect = styled.div`
  cursor: pointer;
  color: ${(props) => props.theme.foreground};
`


function ConnectionCell({ connection }: { connection: Connection }) {
  const { sendCommand } = useContext(ReactotronContext)
  const [ConnectionIcon, platformName, platformDetails, connectionName, screen] = useMemo(() => {

    return [
      getIcon(connection),
      getPlatformName(connection),
      getPlatformDetails(connection),
      getConnectionName(connection),
      getScreen(connection),
    ]
  }, [connection])

  return (
    <ConnectionContainer>
      <LeftContainer>
        <IconContainer>
          <ConnectionIcon size={32} />
        </IconContainer>
        <AppName>{connectionName}</AppName>
      </LeftContainer>

      <MiddleContainer>
        <PlatformDetails>
          {platformName} {platformDetails}
        </PlatformDetails>
        <Screen>{screen}</Screen>
      </MiddleContainer>

      <ActionsContainer>
        <ConnectionDisconnect>
          <MdOutlet
            size={24}
            onClick={() => {
              sendCommand("clientDisconnect", {}, connection.clientId)
            }}
          />
        </ConnectionDisconnect>
      </ActionsContainer>
    </ConnectionContainer>
  )
}

function Connections() {
  const { connections  } = useContext(StandaloneContext)

  return (
    <Container>
      <Header title="Connections" isDraggable actions={connections.length > 0  ? [
        {
          tip: "Clear",
          icon: MdDeleteSweep,
          onClick: () => {
            // clearSelectedConnectionCommands()
          },
        },
      ] : []} />
      <ContentContainer>
        {connections.length > 0 ? (
          connections.map((connection) => (
            <ConnectionCell key={connection.clientId} connection={connection} />
          ))
        ) : (
          <Welcome />
        )}
        <AndroidDeviceHelp />
      </ContentContainer>
    </Container>
  )
}

export default Connections
