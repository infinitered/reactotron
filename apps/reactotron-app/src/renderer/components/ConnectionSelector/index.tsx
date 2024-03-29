import React, { useMemo } from "react"
import styled from "styled-components"
import { MdCheckCircle as Checkmark } from "react-icons/md"

import {
  getIcon,
  getPlatformName,
  getPlatformDetails,
  getConnectionName,
} from "../../util/connectionHelpers"
import { Connection } from "../../contexts/Standalone/useStandalone"

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0 0 auto;
  cursor: pointer;
  margin-right: 20px;
  align-items: center;
`

const IconContainer = styled.div`
  position: relative;
`

const CheckmarkContainer = styled.div`
  position: absolute;
  bottom: -3px;
  right: -3px;
  color: green;
`

const InfoContainer = styled.div`
  margin-left: 10px;
`

interface ConnectionSelectorProps {
  selectedConnection: Connection | null
  connection: Connection
  onClick: () => void
}

export default function ConnectionSelector({
  selectedConnection,
  connection,
  onClick,
}: ConnectionSelectorProps) {
  const isSelected = selectedConnection && selectedConnection.clientId === connection.clientId

  const [ConnectionIcon, platformName, platformDetails, connectionName] = useMemo(() => {
    return [
      getIcon(connection),
      getPlatformName(connection),
      getPlatformDetails(connection),
      getConnectionName(connection),
    ]
  }, [connection])

  return (
    <Container onClick={onClick}>
      <IconContainer>
        <ConnectionIcon size={32} />
        {isSelected && (
          <CheckmarkContainer>
            <Checkmark />
          </CheckmarkContainer>
        )}
      </IconContainer>
      <InfoContainer>
        <div>{connectionName}</div>
        <div>
          {platformName} {platformDetails}
        </div>
      </InfoContainer>
    </Container>
  )
}
