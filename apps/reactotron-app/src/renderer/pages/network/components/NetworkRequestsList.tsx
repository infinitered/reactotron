import React from "react"
import { VirtualizedList } from "../virtualized-list"
import { Command } from "../types"
import Styles from "../network.styles"

interface NetworkRequestsListProps {
  filteredCommands: Command[]
  containerHeight: number
  currentCommandId?: number
  onRequestClick: (messageId: number) => void
}

const { RequestContainer, RequestItem } = Styles

export const NetworkRequestsList: React.FC<NetworkRequestsListProps> = ({
  filteredCommands,
  containerHeight,
  currentCommandId,
  onRequestClick,
}) => {
  return (
    <RequestContainer>
      <VirtualizedList
        getKey={(item) => item.messageId.toString()}
        data={filteredCommands}
        itemHeight={50}
        height={containerHeight}
        renderItem={(command) => {
          return (
            <RequestItem
              key={command?.messageId}
              onClick={() => onRequestClick(command?.messageId)}
              className={currentCommandId === command?.messageId ? "active" : ""}
            >
              <p>{command.payload?.request?.url}</p>
            </RequestItem>
          )
        }}
      />
    </RequestContainer>
  )
}
