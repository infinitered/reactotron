import React from "react"
import { MdReorder } from "react-icons/md"

import HeaderTabButton from "./index"

export default {
  title: "Header Tab Button",
}

export const Inactive = () => (
  <div style={{ width: 80 }}>
    <HeaderTabButton icon={MdReorder} text="Hello?" isActive={false} onClick={() => {}} />
  </div>
)

export const Active = () => (
  <div style={{ width: 80 }}>
    <HeaderTabButton icon={MdReorder} text="Hello?" isActive onClick={() => {}} />
  </div>
)
