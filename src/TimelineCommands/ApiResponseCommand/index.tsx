import React, { useState, FunctionComponent } from "react"
import styled from "styled-components"
import { MdCallReceived, MdCallMade, MdReceipt, MdContentCopy } from "react-icons/md"

import TimelineCommand from "../../TimelineCommand"
import TimelineCommandTabButton from "../../TimelineCommandTabButton"
import ContentView from "../../ContentView"
import { apiToMarkdown } from "../../utils/api-to-markdown"
import { apiRequestToCurl } from "../../utils/api-to-curl"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"

// TODO: Consider if this is a component that should be built into the TimelineCommand...
const NameContainer = styled.div`
  color: ${props => props.theme.bold};
  padding-bottom: 10px;
`

const TabsContainer = styled.div`
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
`

export enum Tab {
  None = "none",
  RequestHeaders = "requestHeaders",
  RequestBody = "requestBody",
  RequestParams = "requestParams",
  ResponseHeaders = "responseHeaders",
  ResponseBody = "responseBody",
}

interface ApiResponsePayload {
  duration: number
  request: {
    data: any // ¯\_(ツ)_/¯
    headers: { [key: string]: string }
    method: string
    params: any // ¯\_(ツ)_/¯
    url: string
  }
  response: {
    body: string
    headers: { [key: string]: string }
    status: number
  }
}

interface Props extends TimelineCommandProps<ApiResponsePayload> {
  initialTab?: Tab
}

function createTabBuilder(onTab: Tab, setOnTab: (tab: Tab) => void) {
  const tabBuilder = (currentTab: Tab, text: string) => {
    return (
      <TimelineCommandTabButton
        isActive={onTab === currentTab}
        text={text}
        onClick={() => {
          if (onTab === currentTab) {
            setOnTab(Tab.None)
          } else {
            setOnTab(currentTab)
          }
        }}
      />
    )
  }

  return tabBuilder
}

function buildToolbar(commandPayload, copyToClipboard: (text: string) => void) {
  const toolbarItems = []

  toolbarItems.push({
    icon: MdCallReceived,
    onClick: () => {
      const text = JSON.stringify(commandPayload.response.body, null, 2)
      copyToClipboard(text)
    },
    tip: "Copy JSON response to clipboard",
  })

  if (commandPayload.request.data) {
    // Is requestBody not empty
    toolbarItems.push({
      icon: MdCallMade,
      onClick: () => {
        try {
          const text = JSON.stringify(JSON.parse(commandPayload.request.data), null, 2)
          copyToClipboard(text)
        } catch {
          copyToClipboard(commandPayload.request.data)
        }
      },
      tip: "Copy JSON request to clipboard",
    })
  }

  toolbarItems.push(
    {
      icon: MdReceipt,
      onClick: () => {
        const text = apiToMarkdown(commandPayload)
        copyToClipboard(text)
      },
      tip: "Copy as markdown to clipboard",
    },
    {
      icon: MdContentCopy,
      onClick: () => {
        const text = apiRequestToCurl(commandPayload)
        copyToClipboard(text)
      },
      tip: "Copy JSON request as cURL",
    }
  )

  return toolbarItems
}

const ApiResponseCommand: FunctionComponent<Props> = ({
  command,
  copyToClipboard,
  isOpen,
  setIsOpen,
  initialTab,
}) => {
  const [onTab, setOnTab] = useState<Tab>(initialTab || null)

  const { payload, date, deltaTime } = command
  const { duration, request, response } = payload

  const cleanedUrl = request.url.replace(/^http(s):\/\/[^/]+/i, "").replace(/\?.*$/i, "")
  const preview = `${(request.method || "").toUpperCase()} ${cleanedUrl}`

  const summary = {
    "Status Code": response.status,
    Method: request.method,
    "Duration (ms)": duration,
  }

  const tabBuilder = createTabBuilder(onTab, setOnTab)

  const toolbar = buildToolbar(payload, copyToClipboard)

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title="API RESPONSE"
      preview={preview}
      toolbar={toolbar}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <NameContainer>{payload.request.url}</NameContainer>
      <ContentView value={summary} />
      <TabsContainer>
        {tabBuilder(Tab.ResponseBody, "Response")}
        {tabBuilder(Tab.ResponseHeaders, "Response Headers")}
        {!!request.data && tabBuilder(Tab.RequestBody, "Request")}
        {!!request.params && tabBuilder(Tab.RequestParams, "Request Params")}
        {tabBuilder(Tab.RequestHeaders, "Request Headers")}
      </TabsContainer>
      {onTab === Tab.ResponseBody && <ContentView value={response.body} />}
      {onTab === Tab.ResponseHeaders && <ContentView value={response.headers} />}
      {onTab === Tab.RequestBody && <ContentView value={request.data} treeLevel={1} />}
      {onTab === Tab.RequestParams && <ContentView value={request.params} />}
      {onTab === Tab.RequestHeaders && <ContentView value={request.headers} />}
    </TimelineCommand>
  )
}

export default buildTimelineCommand(ApiResponseCommand)

export { ApiResponseCommand }
