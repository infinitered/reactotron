/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

import DispatchActionModal from "./index"

export default {
  title: "Dispatch Action Modal",
}

export const Darwin = () => (
  <DispatchActionModal isOpen onClose={() => {}} onDispatchAction={() => {}} isDarwin />
)

export const NonDarwin = () => (
  <DispatchActionModal isOpen onClose={() => {}} onDispatchAction={() => {}} isDarwin={false} />
)
