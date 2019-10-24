import React from "react"
import { boolean } from "@storybook/addon-knobs"
import { MdReorder } from "react-icons/md"

import TimelineCommand from "./index"

export default {
  title: "Timeline Command",
}

export const Closed = () => (
  <TimelineCommand
    date={new Date("2019-01-01T10:32:43.435")}
    title="My Command!"
    preview="Test Preview"
    isOpen={false}
    setIsOpen={() => {}}
  >
    You should not see me.
  </TimelineCommand>
)

export const Opened = () => (
  <TimelineCommand
    date={new Date("2019-01-01T10:32:43.435")}
    title="My Command!"
    preview="Test Preview"
    isOpen
    setIsOpen={() => {}}
  >
    <div style={{ color: "white" }}>You should see me!</div>
  </TimelineCommand>
)

export const Toolbar = () => (
  <TimelineCommand
    date={new Date("2019-01-01T10:32:43.435")}
    title="My Command!"
    preview="Test Preview"
    isOpen
    setIsOpen={() => {}}
    toolbar={[{ icon: MdReorder, tip: "Test", onClick: () => {} }]}
  >
    <div style={{ color: "white" }}>You should see me!</div>
  </TimelineCommand>
)

export const Important = () => (
  <TimelineCommand
    date={new Date("2019-01-01T10:32:43.435")}
    title="My Command!"
    preview="Test Preview"
    isImportant
    isOpen={false}
    setIsOpen={() => {}}
  >
    You should not see me.
  </TimelineCommand>
)

export const Tagged = () => (
  <TimelineCommand
    date={new Date("2019-01-01T10:32:43.435")}
    title="My Command!"
    preview="Test Preview"
    isTagged
    isOpen={false}
    setIsOpen={() => {}}
  >
    You should not see me.
  </TimelineCommand>
)

export const TaggedImportant = () => (
  <TimelineCommand
    date={new Date("2019-01-01T10:32:43.435")}
    title="My Command!"
    preview="Test Preview"
    isTagged
    isImportant
    isOpen={false}
    setIsOpen={() => {}}
  >
    You should not see me.
  </TimelineCommand>
)

export const Interactive = () => {
  const isOpen = boolean("isOpen", false)

  return (
    <TimelineCommand
      date={new Date("2019-01-01T10:32:43.435")}
      title="My Command!"
      preview="Test Preview"
      isOpen={isOpen}
      setIsOpen={() => {}}
    >
      <div style={{ color: "white" }}>You should see me!</div>
    </TimelineCommand>
  )
}
