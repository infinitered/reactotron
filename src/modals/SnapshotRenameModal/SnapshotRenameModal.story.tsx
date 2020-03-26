/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

import SnapshotRenameModal from "./index"

export default {
  title: "Snapshot Rename Modal",
}

export const Default = () => (
  <SnapshotRenameModal
    snapshot={{ name: "Thursday @ 10:00:00 pm" }}
    isOpen
    onClose={() => {}}
    onRenameSnapshot={() => {}}
  />
)
