/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

import DiagnosticModal from "./index"

export default {
  title: "Diagnostic Modal",
}

export const Default = () => (
  <DiagnosticModal isOpen onClose={() => {}} onRefresh={() => console.info("Refreshed")} port={"9090"} serverStatusText="started" />
)
