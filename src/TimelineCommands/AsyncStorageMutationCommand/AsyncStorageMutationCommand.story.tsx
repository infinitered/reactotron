import React from "react"

import { AsyncStorageMutationCommand } from "./index"

export default {
  title: "Timeline Commands/Async Storage Mutation Command",
}

const asyncStorageMutationCommand = {
  clientId: "",
  connectionId: 0,
  deltaTime: 0,
  important: false,
  messageId: 0,
  type: "",
  payload: { action: "setItem", data: { key: "MyKey" } },
  date: new Date("2019-01-01T10:12:23.435"),
}

export const AsyncStorageMutationCommandClosed = () => (
  <AsyncStorageMutationCommand
    command={asyncStorageMutationCommand}
    isOpen={false}
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)

export const AsyncStorageMutationCommandOpen = () => (
  <AsyncStorageMutationCommand
    command={asyncStorageMutationCommand}
    isOpen
    setIsOpen={() => {}}
    copyToClipboard={() => {}}
  />
)
