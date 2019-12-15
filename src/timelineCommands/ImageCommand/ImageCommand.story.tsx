import React from "react"

import { ImageCommand } from "./index"

export default {
  title: "Timeline Commands/Image Command",
}

const imageCommand = {
  clientId: "",
  connectionId: 0,
  deltaTime: 0,
  important: false,
  messageId: 0,
  type: "",
  payload: {
    uri:
      "https://github.com/infinitered/reactotron/raw/master/docs/images/readme/Reactotron-128.png",
    preview: "Test",
    caption: "Test",
    width: 10,
    height: 10,
    filename: "Test",
  },
  date: new Date("2019-01-01T10:12:23.435"),
}

export const Closed = () => (
  <ImageCommand command={imageCommand} isOpen={false} setIsOpen={() => {}} />
)

export const Open = () => <ImageCommand command={imageCommand} isOpen setIsOpen={() => {}} />
