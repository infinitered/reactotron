/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

import SubscriptionAddModal from "./index"

export default {
  title: "Subscription Add Modal",
}

export const Default = () => (
  <SubscriptionAddModal isOpen onClose={() => {}} onAddSubscription={() => {}} />
)
