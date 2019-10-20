import React from "react"
import { MdReorder } from "react-icons/md"

import Header from "./index"

export default {
  title: "Header",
}

export const Default = () => <Header title="Header!" />
export const Actions = () => (
  <Header title="Header!" actions={[{ tip: "Test 1", icon: MdReorder, onClick: () => {} }]} />
)
export const Children = () => (
  <Header title="Header!">
    <p>Hello!</p>
  </Header>
)
