import React from "react"

import { DisplayCommand } from "./index"

export default {
  title: "Timeline Commands/Display Command",
}

const displayCommandBasic = {
  clientId: "",
  connectionId: 0,
  deltaTime: 0,
  important: false,
  messageId: 0,
  type: "",
  payload: { preview: "A Preview!", name: "Test?", value: 10 },
  date: new Date("2019-01-01T10:12:23.435"),
}

export const Closed = () => (
  <DisplayCommand
    command={displayCommandBasic}
    isOpen={false}
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)

export const Open = () => (
  <DisplayCommand
    command={displayCommandBasic}
    isOpen
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)

export const NoName = () => (
  <DisplayCommand
    command={{
      ...displayCommandBasic,
      payload: { ...displayCommandBasic.payload, name: undefined },
    }}
    isOpen
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)

export const ObjectValue = () => (
  <DisplayCommand
    command={{
      ...displayCommandBasic,
      payload: { ...displayCommandBasic.payload, value: { test: true, aStr: "Hello!" } },
    }}
    isOpen
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)

export const Image = () => (
  <DisplayCommand
    command={{
      ...displayCommandBasic,
      payload: {
        ...displayCommandBasic.payload,
        value: undefined,
        image:
          "https://github.com/infinitered/reactotron/raw/master/docs/images/readme/Reactotron-128.png",
      },
    }}
    isOpen
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)

export const Important = () => (
  <DisplayCommand
    command={{
      ...displayCommandBasic,
      payload: { ...displayCommandBasic.payload, important: true },
    }}
    isOpen
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)
