/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"
import { MdReorder } from "react-icons/md"

import EmptyState from "./index"

export default {
  title: "Empty State",
}

export const Default = () => (
  <EmptyState icon={MdReorder} title="Empty!">
    Some more information
  </EmptyState>
)
