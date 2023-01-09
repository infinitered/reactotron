/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"
import { storiesOf } from "@storybook/react"

import ConnectionSelector from "./index"

storiesOf("components/ConnectionSelector", module)
  .add("iOS", () => (
    <ConnectionSelector
      selectedConnection={null}
      connection={{
        id: 0,
        platformVersion: "12.4",
        osRelease: "12",
        clientId: "0",
        platform: "ios",
        commands: [],
        connected: true,
      }}
      showName={false}
      onClick={() => {}}
    />
  ))
  .add("Android", () => (
    <ConnectionSelector
      selectedConnection={null}
      connection={{
        id: 0,
        platformVersion: "12.4",
        osRelease: "12",
        clientId: "0",
        platform: "android",
        commands: [],
        connected: true,
      }}
      showName={false}
      onClick={() => {}}
    />
  ))
  .add("Selected", () => (
    <ConnectionSelector
      selectedConnection={{
        id: 0,
        platformVersion: "12.4",
        osRelease: "12",
        clientId: "0",
        platform: "ios",
        commands: [],
        connected: true,
      }}
      connection={{
        id: 0,
        platformVersion: "12.4",
        osRelease: "12",
        clientId: "0",
        platform: "ios",
        commands: [],
        connected: true,
      }}
      showName={false}
      onClick={() => {}}
    />
  ))
  .add("Show Name", () => (
    <ConnectionSelector
      selectedConnection={{
        id: 0,
        platformVersion: "12.4",
        osRelease: "12",
        clientId: "0",
        name: "Test Name",
        platform: "ios",
        commands: [],
        connected: true,
      }}
      connection={{
        id: 0,
        platformVersion: "12.4",
        osRelease: "12",
        clientId: "0",
        name: "Test Name",
        platform: "ios",
        commands: [],
        connected: true,
      }}
      showName
      onClick={() => {}}
    />
  ))
