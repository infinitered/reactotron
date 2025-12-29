import React from "react"
import Styles from "../network.styles"

interface NetworkRequestHeaderProps {
  currSelectedType: string
  onTabChange: (tab: string) => void
  tabContent: Record<string, object>
}

const AvailableTabs = [
  "request headers",
  "request params",
  "request body",
  "response headers",
  "response body",
] as const

const { RequestDataHeader, RequestAvailableTabsContainer } = Styles

export const NetworkRequestHeader: React.FC<NetworkRequestHeaderProps> = ({
  currSelectedType,
  onTabChange,
  tabContent,
}) => {
  return (
    <RequestDataHeader>
      <RequestAvailableTabsContainer>
        {AvailableTabs.map((tab) => {
          const hasTab = tabContent[tab]
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
