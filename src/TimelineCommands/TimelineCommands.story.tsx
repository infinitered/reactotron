import React from "react"

import ClientIntroCommandComponent from "./ClientIntroCommand"

export default {
  title: "Timeline Commands",
}

export const ClientIntroCommand = () => (
  <ClientIntroCommandComponent
    command={{
      payload: { name: "Test?" },
      date: new Date("2019-01-01T10:12:23.435"),
    }}
  />
)
