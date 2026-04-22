import React, { useMemo } from "react"
import styled from "styled-components"
import { MdCheckCircle as Checkmark, MdClose as CloseIcon } from "react-icons/md"

import {
  getIcon,
  getPlatformName,
  getPlatformDetails,
  getConnectionName,
} from "../../util/connectionHelpers"
import { Connection } from "../../contexts/Standalone/useStandalone"

interface ContainerProps {
  $isConnected: boolean
}

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: row;
  flex: 0 0 auto;
  cursor: pointer;
  margin-right: 20px;
  align-items: center;
  opacity: ${(props) => (props.$isConnected ? 1 : 0.5)};
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

interface StatusDotProps {
  $isConnected: boolean
}

const StatusDot = styled.div<StatusDotProps>`
  position: absolute;
  top: -2px;
  left: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.$isConnected ? "#50c878" : "#ff6b6b")};
  border: 2px solid ${(props) => props.theme.subtleLine};
`

const InfoContainer = styled.div`
  margin-left: 10px;
`

const DeleteButton = styled.div`
  margin-left: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background-color: #ff4444;
  }
`

interface ConnectionSelectorProps {
  selectedConnection: Connection | null
  connection: Connection
  onClick: () => void
  onDelete?: (clientId: string) => void
}

export default function ConnectionSelector({
  selectedConnection,
  connection,
  onClick,
  onDelete,
}: ConnectionSelectorProps) {
  const isSelected = selectedConnection && selectedConnection.clientId === connection.clientId
  const isConnected = connection.connected

  const [ConnectionIcon, platformName, platformDetails, connectionName] = useMemo(() => {
    return [
      getIcon(connection),
      getPlatformName(connection),
      getPlatformDetails(connection),
      getConnectionName(connection),
    ]
  }, [connection])

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete && !isConnected) {
      onDelete(connection.clientId)
    }
  }

  return (
    <Container onClick={onClick} $isConnected={isConnected}>
      <IconContainer>
        <ConnectionIcon size={32} />
        <StatusDot $isConnected={isConnected} title={isConnected ? "Connected" : "Disconnected"} />
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
      {!isConnected && onDelete && (
        <DeleteButton onClick={handleDelete} title="Remove disconnected connection">
          <CloseIcon size={12} color="white" />
        </DeleteButton>
      )}
    </Container>
  )
}
