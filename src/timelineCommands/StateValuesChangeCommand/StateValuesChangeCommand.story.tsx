/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

import { StateValuesChangeCommand } from "./index"

export default {
  title: "Timeline Commands/State Values Change Command",
}

function buildCommand({
  added = [],
  changed = [],
  changes = [],
  removed = [],
}: {
  added?: any
  changed?: any
  changes?: any
  removed?: any
}) {
  return {
    clientId: "",
    connectionId: 0,
    deltaTime: 0,
    important: false,
    messageId: 0,
    type: "",
    payload: {
      added,
      changed,
      changes,
      removed,
    },
    date: new Date("2019-01-01T10:12:23.435"),
  }
}

export const ClosedAdded = () => (
  <StateValuesChangeCommand
    command={buildCommand({ added: { dummyReducer: { counter: 0 } } })}
    isOpen={false}
    setIsOpen={() => {}}
  />
)

export const ClosedChanged = () => (
  <StateValuesChangeCommand
    command={buildCommand({ changed: { dummyReducer: { counter: 0 } } })}
    isOpen={false}
    setIsOpen={() => {}}
  />
)

export const ClosedRemoved = () => (
  <StateValuesChangeCommand
    command={buildCommand({ removed: { dummyReducer: { counter: 0 } } })}
    isOpen={false}
    setIsOpen={() => {}}
  />
)

export const ClosedAll = () => (
  <StateValuesChangeCommand
    command={buildCommand({
      added: { dummyReducer: { counter: 0 } },
      changed: { dummyReducer: { counter: 0 } },
      removed: { dummyReducer: { counter: 0 } },
    })}
    isOpen={false}
    setIsOpen={() => {}}
  />
)

export const OpenAdded = () => (
  <StateValuesChangeCommand
    command={buildCommand({ added: { dummyReducer: { counter: 0 } } })}
    isOpen
    setIsOpen={() => {}}
  />
)

export const OpenChanged = () => (
  <StateValuesChangeCommand
    command={buildCommand({ changed: { dummyReducer: { counter: 0 } } })}
    isOpen
    setIsOpen={() => {}}
  />
)

export const OpenRemoved = () => (
  <StateValuesChangeCommand
    command={buildCommand({ removed: { dummyReducer: { counter: 0 } } })}
    isOpen
    setIsOpen={() => {}}
  />
)

export const OpenAll = () => (
  <StateValuesChangeCommand
    command={buildCommand({
      added: { dummyReducer: { counter: 0 } },
      changed: { dummyReducer: { counter: 0 } },
      removed: { dummyReducer: { counter: 0 } },
    })}
    isOpen
    setIsOpen={() => {}}
  />
)
