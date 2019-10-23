import React from "react"

import { StateActionCompleteCommand } from "./index"

export default {
  title: "Timeline Commands/State Action Complete Command",
}

const stateActionCompletedCommand = {
  clientId: "",
  connectionId: 0,
  deltaTime: 0,
  important: false,
  messageId: 0,
  type: "",
  payload: { name: "Test?", action: {} },
  date: new Date("2019-01-01T10:12:23.435"),
}

export const StateActionCompleteCommandClosed = () => (
  <StateActionCompleteCommand
    command={stateActionCompletedCommand}
    isOpen={false}
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)

export const StateActionCompleteCommandOpen = () => (
  <StateActionCompleteCommand
    command={stateActionCompletedCommand}
    isOpen
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)
