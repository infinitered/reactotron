/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"
import { storiesOf } from "@storybook/react"

import { Connection } from "../../contexts/Standalone/useStandalone"

import Footer from "./Stateless"

const testConnections: Connection[] = [
  { id: 0, clientId: "1", name: "Test 1", commands: [], platform: "ios", platformVersion: "12", connected: true },
  { id: 0, clientId: "1", name: "Test 2", commands: [], platform: "ios", platformVersion: "12", connected: true },
  { id: 0, clientId: "1", name: "Test 3", commands: [], platform: "ios", platformVersion: "12", connected: true },
  { id: 0, clientId: "1", name: "Test 4", commands: [], platform: "ios", platformVersion: "12", connected: true },
  { id: 0, clientId: "1", name: "Test 5", commands: [], platform: "ios", platformVersion: "12", connected: true },
]

storiesOf("components/Footer", module)
  .add("Collpased", () => (
    <Footer
      connections={[]}
      selectedConnection={null}
      isOpen={false}
      setIsOpen={() => {}}
      onChangeConnection={() => {}}
    />
  ))
  .add("Collpased w/ connections", () => (
    <Footer
      connections={testConnections}
      selectedConnection={null}
      isOpen={false}
      setIsOpen={() => {}}
      onChangeConnection={() => {}}
    />
  ))
  .add("Expanded", () => (
    <Footer
      connections={[]}
      selectedConnection={null}
      isOpen
      setIsOpen={() => {}}
      onChangeConnection={() => {}}
    />
  ))
  .add("Expanded w/ connections", () => (
    <Footer
      connections={testConnections}
      selectedConnection={null}
      isOpen
      setIsOpen={() => {}}
      onChangeConnection={() => {}}
    />
  ))
  .add("Expanded w/ lots connections", () => (
    <Footer
      connections={[...testConnections, ...testConnections, ...testConnections]}
      selectedConnection={null}
      isOpen
      setIsOpen={() => {}}
      onChangeConnection={() => {}}
    />
  ))
