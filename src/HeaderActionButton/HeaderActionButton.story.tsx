import React from "react"
import { MdReorder } from "react-icons/md"

import HeaderActionButton from "./index"

export default {
  title: "Header Action Button",
}

export const Default = () => (
  <HeaderActionButton tip="This is the tooltip." icon={MdReorder} onClick={() => {}} />
)
