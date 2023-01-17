import React from "react"

import Timestamp from "./index"

export default {
  title: "Timestamp",
}

export const Default = () => <Timestamp date={new Date("2019-01-01T10:12:23.435")} deltaTime={50} />
