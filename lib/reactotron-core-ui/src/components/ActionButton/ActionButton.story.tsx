/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"
import { MdReorder } from "react-icons/md"

import ActionButton from "./index"

export default {
  title: "Action Button",
}

export const Default = () => (
  <ActionButton tip="This is the tooltip." icon={MdReorder} onClick={() => {}} />
)
