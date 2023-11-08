import React, { FunctionComponent } from "react"
import { MdContentCopy } from "react-icons/md"
import styled from "rn-css"

import ContentView from "../../components/ContentView"
import TimelineCommand from "../../components/TimelineCommand"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"

const ImageContainer = styled.View``

const Image = styled.Image`
  max-width: 100%;
  max-height: 100%;
`

interface DisplayPayload {
  name: string
  value?: any
  image?: any
  preview?: string
}

interface Props extends TimelineCommandProps<DisplayPayload> {}

function buildToolbar(commandPayload, copyToClipboard: (text: string) => void) {
  if (!copyToClipboard) return []

  return [
    {
      icon: MdContentCopy,
      onClick: () => {
        const message = commandPayload.value

        if (!message) return

        if (typeof message === "string") {
          copyToClipboard(message)
        } else {
          copyToClipboard(JSON.stringify(message, null, 2))
        }
      },
      tip: "Copy text to clipboard",
    },
  ]
}

const DisplayCommand: FunctionComponent<Props> = ({
  command,
  isOpen,
  setIsOpen,
  copyToClipboard,
}) => {
  const { payload, date, deltaTime, important } = command

  let imageUrl
  if (payload.image) {
    if (typeof payload.image === "string") {
      imageUrl = payload.image
    } else {
      imageUrl = payload.image.uri
    }
  }

  const toolbar = buildToolbar(payload, copyToClipboard)

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title={payload.name || "DISPLAY"}
      preview={payload.preview}
      toolbar={toolbar}
      isImportant={important}
      isTagged
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {payload.value && <ContentView value={payload.value} />}
      {imageUrl && (
        <ImageContainer>
          <Image src={imageUrl} />
        </ImageContainer>
      )}
    </TimelineCommand>
  )
}

export default buildTimelineCommand(DisplayCommand)
export { DisplayCommand }
