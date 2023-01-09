import React from "react"
import styled from "styled-components"
import { MdCheckCircle as Checkmark } from "react-icons/md"

import { getIcon, getPlatformName, getPlatformDetails } from "../../util/connectionHelpers"
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

interface Props {
  selectedConnection: Connection | null
  connection: Connection
  showName: boolean
  onClick: () => void
}

export default function ConnectionSelector({
  selectedConnection,
  connection,
  showName,
  onClick,
}: Props) {
  const isSelected = selectedConnection && selectedConnection.clientId === connection.clientId
  const ConnectionIcon = getIcon(connection)

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
        <div>
          {getPlatformName(connection)}
          {showName ? ` - ${connection.name}` : ""}
        </div>
        <div>{getPlatformDetails(connection)}</div>
      </InfoContainer>
    </Container>
  )
}
