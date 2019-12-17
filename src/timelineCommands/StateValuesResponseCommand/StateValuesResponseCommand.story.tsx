/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

import { StateValuesResponseCommand } from "./index"

export default {
  title: "Timeline Commands/State Values Response Command",
}

function buildCommand(value: any, path: string, valid = true) {
  return {
    clientId: "",
    connectionId: 0,
    deltaTime: 0,
    important: false,
    messageId: 0,
    type: "",
    payload: {
      value,
      path,
      valid,
    },
    date: new Date("2019-01-01T10:12:23.435"),
  }
}

export const Closed = () => (
  <StateValuesResponseCommand
    command={buildCommand({ counter: 0 }, "dummyReducer")}
    isOpen={false}
    setIsOpen={() => {}}
  />
)

export const SimpleValue = () => (
  <StateValuesResponseCommand
    command={buildCommand(0, "dummyReducer")}
    isOpen
    setIsOpen={() => {}}
  />
)

export const Object = () => (
  <StateValuesResponseCommand
    command={buildCommand({ counter: 0 }, "dummyReducer")}
    isOpen
    setIsOpen={() => {}}
  />
)
