import React from "react"
import { VirtualizedList } from "./VirtualizedList"
import { Command } from "../types"
import Styles from "../network.styles"

interface NetworkRequestsListProps {
  filteredCommands: Command[]
  containerHeight: number
  currentCommandId?: number
  onRequestClick: (messageId: number) => void
  overscan?: number
}

const { 
  RequestContainer, 
  RequestItem,
  RequestTableHeader,
  RequestTableHeaderCell,
  RequestTableCell,
} = Styles

export const NetworkRequestsList: React.FC<NetworkRequestsListProps> = ({
  filteredCommands,
  containerHeight,
  currentCommandId,
  onRequestClick,
  overscan = 5,
}) => {
  const formatTime = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  return (
    <RequestContainer>
      <RequestTableHeader>
        <RequestTableHeaderCell style={{ width: '80px' }}>Time</RequestTableHeaderCell>
        <RequestTableHeaderCell style={{ width: '70px' }}>Method</RequestTableHeaderCell>
        <RequestTableHeaderCell style={{ flex: 1 }}>URL</RequestTableHeaderCell>
        <RequestTableHeaderCell style={{ width: '70px' }}>Status</RequestTableHeaderCell>
      </RequestTableHeader>
      <VirtualizedList
        getKey={(item) => item.messageId.toString()}
        data={filteredCommands}
        itemHeight={50}
        height={containerHeight - 40}
        overscan={overscan}
        renderItem={(command) => {
          const shortenedUrl = command.payload?.request?.url?.split("://")[1] || command.payload?.request?.url || "N/A"
          const method = command.payload?.request?.method?.toUpperCase() || "N/A"
          const status = command.payload?.response?.status || "N/A"
          const time = formatTime(command.date)

          return (
            <RequestItem
              key={command?.messageId}
              onClick={() => onRequestClick(command?.messageId)}
              className={currentCommandId === command?.messageId ? "active" : ""}
            >
              <RequestTableCell style={{ width: '80px' }}>{time}</RequestTableCell>
              <RequestTableCell style={{ width: '70px' }} method={method}>{method}</RequestTableCell>
              <RequestTableCell style={{ flex: 1 }} title={command.payload?.request?.url}>
                {shortenedUrl}
              </RequestTableCell>
              <RequestTableCell style={{ width: '70px' }} status={status}>{status}</RequestTableCell>
            </RequestItem>
          )
        }}
      />
    </RequestContainer>
  )
}
