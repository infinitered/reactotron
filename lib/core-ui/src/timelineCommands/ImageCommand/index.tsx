import React, { FunctionComponent } from "react"
import styled from "styled-components"

import TimelineCommand from "../../components/TimelineCommand"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`
const Caption = styled.div`
  padding: 10px 0;
  font-size: larger;
  color: ${props => props.theme.foreground};
`
const Dimensions = styled.div`
  color: ${props => props.theme.constant};
`
const Filename = styled.div`
  color: ${props => props.theme.highlight};
`

interface ImagePayload {
  uri: string
  preview: string
  caption?: string
  width?: number
  height?: number
  filename?: string
}

interface Props extends TimelineCommandProps<ImagePayload> {}

const ImageCommand: FunctionComponent<Props> = ({ command, isOpen, setIsOpen }) => {
  const { payload, date, deltaTime } = command

  const dimensions = payload.width && payload.height && `${payload.width} x ${payload.height}`

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title="IMAGE"
      preview={payload.preview}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Image src={payload.uri} />
      {payload.caption && <Caption>{payload.caption}</Caption>}
      {dimensions && <Dimensions>{dimensions}</Dimensions>}
      {payload.filename && <Filename>{payload.filename}</Filename>}
    </TimelineCommand>
  )
}

export default buildTimelineCommand(ImageCommand)
export { ImageCommand }
