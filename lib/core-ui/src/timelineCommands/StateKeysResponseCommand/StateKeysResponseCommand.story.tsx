/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

import { StateKeysResponseCommand } from "./index"

export default {
  title: "Timeline Commands/State Keys Response Command",
}

function buildCommand(keys: string[], path: string, valid = true) {
  return {
    clientId: "",
    connectionId: 0,
    deltaTime: 0,
    important: false,
    messageId: 0,
    type: "",
    payload: {
      keys,
      path,
      valid,
    },
    date: new Date("2019-01-01T10:12:23.435"),
  }
}

export const Closed = () => (
  <StateKeysResponseCommand
    command={buildCommand(["dummyReducer"], null)}
    isOpen={false}
    setIsOpen={() => {}}
  />
)

export const Null = () => (
  <StateKeysResponseCommand command={buildCommand(null, null)} isOpen setIsOpen={() => {}} />
)

export const Empty = () => (
  <StateKeysResponseCommand command={buildCommand([], null)} isOpen setIsOpen={() => {}} />
)

export const Root = () => (
  <StateKeysResponseCommand
    command={buildCommand(["dummyReducer", "anotherReducer"], null)}
    isOpen
    setIsOpen={() => {}}
  />
)

export const FirstLevel = () => (
  <StateKeysResponseCommand
    command={buildCommand(["aValue", "anotherValue"], "dummyReducer")}
    isOpen
    setIsOpen={() => {}}
  />
)
