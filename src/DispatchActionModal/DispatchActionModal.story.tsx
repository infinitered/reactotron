import React from "react"

import DispatchActionModal from "./index"

export default {
  title: "Dispatch Action Modal",
}

export const Default = () => (
  <DispatchActionModal isOpen onClose={() => {}} onDispatchAction={() => {}} />
)
