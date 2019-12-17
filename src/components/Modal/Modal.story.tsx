/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

import Modal from "./index"

export default {
  title: "Modal",
}

export const Default = () => (
  <Modal title="My Modal" isOpen onClose={() => {}}>
    <div>Hello</div>
  </Modal>
)
