/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

import { LogCommand } from "./index"

export default {
  title: "Timeline Commands/Log Command",
}

declare const __dirname: string

function buildCommand(payload: { level: any; message: any; stack?: any }, important?: boolean) {
  return {
    clientId: "",
    connectionId: 0,
    deltaTime: 0,
    messageId: 0,
    type: "",
    payload,
    important,
    date: new Date("2019-01-01T10:12:23.435"),
  }
}

export const ClosedWithMessage = () => (
  <LogCommand
    command={buildCommand({ level: "error", message: "A basic example" })}
    isOpen={false}
    setIsOpen={() => {}}
  />
)

export const ClosedWithObject = () => (
  <LogCommand
    command={buildCommand({
      level: "error",
      message: { num: 1, obj: { test: true }, what: "is this?", lets: "go deeper" },
    })}
    isOpen={false}
    setIsOpen={() => {}}
  />
)

export const ClosedWithLargeObject = () => (
  <LogCommand
    command={buildCommand({
      level: "error",
      message: {
        num: 1,
        obj: { test: true },
        what: "is this?",
        lets: "go deeper",
        temp: 1,
        shouldShow: false,
      },
    })}
    isOpen={false}
    setIsOpen={() => {}}
  />
)

export const OpenWithMessage = () => (
  <LogCommand
    command={buildCommand({ level: "error", message: "A basic example" })}
    isOpen
    setIsOpen={() => {}}
  />
)

export const OpenImportant = () => (
  <LogCommand
    command={buildCommand({ level: "error", message: "A basic example" }, true)}
    isOpen
    setIsOpen={() => {}}
  />
)

export const OpenWithObject = () => (
  <LogCommand
    command={buildCommand({
      level: "error",
      message: {
        num: 1,
        obj: { test: true },
        what: "is this?",
        lets: "go deeper",
        temp: 1,
        shouldShow: false,
      },
    })}
    isOpen
    setIsOpen={() => {}}
    readFile={async () => ""}
  />
)

export const OpenWithStack = () => (
  <LogCommand
    command={buildCommand({
      level: "error",
      message: "This would be an error",
      stack: [
        {
          fileName: `${__dirname}/testFile.js`,
          functionName: "testFunc()",
          lineNumber: 6,
        },
        {
          fileName: "test/testNested.js",
          functionName: "testFunc()",
          lineNumber: 23,
        },
        {
          fileName: "/node_modules/testNested.js",
          functionName: "testFunc()",
          lineNumber: 23,
        },
        {
          fileName: "webpack://testNested.js",
          functionName: "testFunc()",
          lineNumber: 23,
        },
      ],
    })}
    isOpen
    setIsOpen={() => {}}
  />
)

export const OpenWithStackAndSource = () => (
  <LogCommand
    command={buildCommand({
      level: "error",
      message: "This would be an error",
      stack: [
        {
          fileName: `${__dirname}/testFile.js`,
          functionName: "testFunc()",
          lineNumber: 6,
        },
        {
          fileName: "test/testNested.js",
          functionName: "testFunc()",
          lineNumber: 23,
        },
        {
          fileName: "/node_modules/testNested.js",
          functionName: "testFunc()",
          lineNumber: 23,
        },
        {
          fileName: "webpack://testNested.js",
          functionName: "testFunc()",
          lineNumber: 23,
        },
      ],
    })}
    isOpen
    setIsOpen={() => {}}
    readFile={() =>
      new Promise((resolve) =>
        resolve(`
module.exports = {
  test: true,
  so: "many",
  lines: true,
  of: "code!",
  need: 9,
  still: "more",
  to: "go",
}
      `)
      )
    }
  />
)
