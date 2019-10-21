import React, { useState } from "react"
import styled from "styled-components"
import { MdCallReceived, MdCallMade, MdReceipt, MdContentCopy } from "react-icons/md"

import TimelineCommand from "../TimelineCommand"
import TimelineCommandTabButton from "../TimelineCommandTabButton"
import ContentView from "../ContentView"
import { apiToMarkdown } from "../utils/api-to-markdown"
import { apiRequestToCurl } from "../utils/api-to-curl"

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

interface Props {
  command: {
    clientId: string // TODO: Move most of this to a base CommandType
    connectionId: number
    date: Date
    deltaTime: number
    important: boolean
    messageId: number
    payload: {
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
    type: string
  }
  copyToClipboard: (text: string) => void
}

enum Tabs {
  None = "none",
  RequestHeaders = "requestHeaders",
  RequestBody = "requestBody",
  RequestParams = "requestParams",
  ResponseHeaders = "responseHeaders",
  ResponseBody = "responseBody",
}

function createTabBuilder(onTab: Tabs, setOnTab: (tab: Tabs) => void) {
  const tabBuilder = (currentTab: Tabs, text: string) => {
    return (
      <TimelineCommandTabButton
        isActive={onTab === currentTab}
        text={text}
        onClick={() => {
          if (onTab === currentTab) {
            setOnTab(Tabs.None)
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

export default function ApiResponseCommand({ command, copyToClipboard }: Props) {
  const [onTab, setOnTab] = useState<Tabs>(null)

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
    >
      <NameContainer>{payload.request.url}</NameContainer>
      <ContentView value={summary} />
      <TabsContainer>
        {tabBuilder(Tabs.ResponseBody, "Response")}
        {tabBuilder(Tabs.ResponseHeaders, "Response Headers")}
        {!!request.data && tabBuilder(Tabs.RequestBody, "Request")}
        {!!request.params && tabBuilder(Tabs.RequestParams, "Request Params")}
        {tabBuilder(Tabs.RequestHeaders, "Request Headers")}
      </TabsContainer>
      {onTab === Tabs.ResponseBody && <ContentView value={response.body} />}
      {onTab === Tabs.ResponseHeaders && <ContentView value={response.headers} />}
      {onTab === Tabs.RequestBody && <ContentView value={request.data} treeLevel={1} />}
      {onTab === Tabs.RequestParams && <ContentView value={request.params} />}
      {onTab === Tabs.RequestHeaders && <ContentView value={request.headers} />}
    </TimelineCommand>
  )
}
