import React from "react"

import TimelineCommandTabButton from "./index"

export default {
  title: "Timeline Command Tab Button",
}

export const Inactive = () => (
  <TimelineCommandTabButton isActive={false} text="Inactive" onClick={() => {}} />
)

export const Active = () => (
  <TimelineCommandTabButton isActive={true} text="Active" onClick={() => {}} />
)
