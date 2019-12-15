import React from "react"

import { ClientIntroCommand } from "./index"

export default {
  title: "Timeline Commands/Client Intro Command",
}

const clientIntroCommand = {
  clientId: "",
  connectionId: 0,
  deltaTime: 0,
  important: false,
  messageId: 0,
  type: "",
  payload: { name: "Test?" },
  date: new Date("2019-01-01T10:12:23.435"),
}

export const Closed = () => (
  <ClientIntroCommand
    command={clientIntroCommand}
    isOpen={false}
    setIsOpen={() => {}}
  />
)

export const Open = () => (
  <ClientIntroCommand
    command={clientIntroCommand}
    isOpen
    setIsOpen={() => {}}
  />
)
