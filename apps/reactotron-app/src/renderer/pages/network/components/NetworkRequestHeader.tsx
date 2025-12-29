import React from "react"
import { Command } from "../types"
import Styles from "../network.styles"

interface NetworkRequestHeaderProps {
  currentCommand?: Command
  currSelectedType: string
  onTabChange: (tab: string) => void
  tabResolver: (tab: string) => any
}

const AvailableTabs = [
  "request headers",
  "request params",
  "request body",
  "response headers",
  "response",
] as const

const {
  RequestDataHeader,
  RequestMethodStatus,
  HttpMethod,
  StatusCode,
  StatusSeparator,
  RequestAvailableTabsContainer,
  Duration,
} = Styles

export const NetworkRequestHeader: React.FC<NetworkRequestHeaderProps> = ({
  currentCommand,
  currSelectedType,
  onTabChange,
  tabResolver,
}) => {
  console.log(currentCommand)
  return (
    <RequestDataHeader>
      <RequestMethodStatus>
        <HttpMethod method={currentCommand?.payload?.request?.method}>
          {currentCommand?.payload?.request?.method?.toUpperCase() || "N/A"}
        </HttpMethod>
        <StatusSeparator>•</StatusSeparator>
        <StatusCode status={currentCommand?.payload?.response?.status}>
          {currentCommand?.payload?.response?.status || "N/A"}
        </StatusCode>
        <StatusSeparator>•</StatusSeparator>
        <Duration>{currentCommand?.payload?.duration ? `${currentCommand.payload.duration.toFixed(3)}ms` : "N/A"}</Duration>
      </RequestMethodStatus>
      <RequestAvailableTabsContainer>
        {AvailableTabs.map((tab) => {
          const hasTab = tabResolver(tab)
          if (!hasTab) return null

          return (
            <li
              key={tab}
              onClick={() => onTabChange(tab)}
              className={currSelectedType === tab ? "active" : ""}
            >
              {tab}
            </li>
          )
        })}
      </RequestAvailableTabsContainer>
    </RequestDataHeader>
  )
}

export default NetworkRequestHeader
