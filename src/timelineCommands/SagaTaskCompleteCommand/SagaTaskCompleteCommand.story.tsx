/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

import SagaTaskCompleteCommand from "./Stateless"

export default {
  title: "Timeline Commands/Saga Task Complete Command",
}

const sagaTaskCompleteCommand = {
  clientId: "",
  connectionId: 0,
  deltaTime: 0,
  important: false,
  messageId: 0,
  type: "",
  payload: {
    children: [
      {
        depth: 0,
        description: "DUMMY1",
        duration: 1,
        effectId: 5,
        extra: { type: "DUMMY1" },
        name: "PUT",
        parentEffectId: 4,
        result: { type: "DUMMY1" },
        status: "RESOLVED",
        winner: null,
        loser: null,
      },
      {
        depth: 1,
        description: "DUMMY1",
        duration: 1,
        effectId: 5,
        extra: { type: "DUMMY1" },
        name: "PUT",
        parentEffectId: 4,
        result: { type: "DUMMY1" },
        status: "RESOLVED",
        winner: null,
        loser: null,
      },
      {
        depth: 1,
        description: "DUMMY1",
        duration: 1,
        effectId: 5,
        extra: { type: "DUMMY1" },
        name: "PUT",
        parentEffectId: 4,
        result: { type: "DUMMY1" },
        status: "CANCELLED",
        winner: null,
        loser: null,
      },
    ],
    description: undefined,
    duration: 2,
    triggerType: "DUMMY2",
  },
  date: new Date("2019-01-01T10:12:23.435"),
}

export const Closed = () => (
  <SagaTaskCompleteCommand
    command={sagaTaskCompleteCommand}
    isOpen={false}
    setIsOpen={() => {}}
    isDetailsOpen={false}
    setIsDetailsOpen={() => {}}
  />
)

export const Open = () => (
  <SagaTaskCompleteCommand
    command={sagaTaskCompleteCommand}
    isOpen
    setIsOpen={() => {}}
    isDetailsOpen={false}
    setIsDetailsOpen={() => {}}
  />
)

export const DetailsOpen = () => (
  <SagaTaskCompleteCommand
    command={sagaTaskCompleteCommand}
    isOpen
    setIsOpen={() => {}}
    isDetailsOpen
    setIsDetailsOpen={() => {}}
  />
)
