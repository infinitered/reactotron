import React from "react"
import { VirtualizedList } from "./VirtualizedList"
import Styles from "../network.styles"
import { Command, CommandTypeKey } from "reactotron-core-contract"

interface NetworkRequestsListProps {
  filteredCommands: Command<CommandTypeKey, any>[]
  containerHeight: number
  currentCommandId?: number
  onRequestClick: (messageId: number) => void
  overscan?: number
}

const formatTime = (date: Date) => {
  const d = new Date(date)
  return d.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

const formatSize = (bytes: number) => {
  const kb = bytes / 1024
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`
  }
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
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

  return (
    <RequestContainer>
      <RequestTableHeader>
        <RequestTableHeaderCell width="80px">Time</RequestTableHeaderCell>
        <RequestTableHeaderCell width="70px">Method</RequestTableHeaderCell>
        <RequestTableHeaderCell width="flex">URL</RequestTableHeaderCell>
        <RequestTableHeaderCell width="70px">Status</RequestTableHeaderCell>
        <RequestTableHeaderCell width="100px">Size</RequestTableHeaderCell>
      </RequestTableHeader>
      <VirtualizedList
        getKey={(item) => item.messageId.toString()}
        data={filteredCommands}
        itemHeight={50}
        height={containerHeight - 40}
        overscan={overscan}
        renderItem={(command) => {
          const payloadBuffer = Buffer.from(JSON.stringify(command.payload), "utf8");
          const payloadSize = payloadBuffer.byteLength

          const shortenedUrl =
            command.payload?.request?.url?.split("://")[1] || command.payload?.request?.url || "N/A"

          const method = command.payload?.request?.method?.toUpperCase() || "N/A"
          const status = command.payload?.response?.status || "N/A"
          const time = formatTime(command.date)

          return (
            <RequestItem
              key={command?.messageId}
              onClick={() => onRequestClick(command?.messageId)}
              className={currentCommandId === command?.messageId ? "active" : ""}
            >
              <RequestTableCell width="80px">{time}</RequestTableCell>
              <RequestTableCell width="70px" method={method}>
                {method}
              </RequestTableCell>
              <RequestTableCell width="flex" title={command.payload?.request?.url}>
                {shortenedUrl}
              </RequestTableCell>
              <RequestTableCell width="70px" status={status}>
                {status}
              </RequestTableCell>
              <RequestTableCell width="100px" title={`${payloadSize} bytes`}>
                {formatSize(payloadSize)}
              </RequestTableCell>
            </RequestItem>
          )
        }}
      />
    </RequestContainer>
  )
}
