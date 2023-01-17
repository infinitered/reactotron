import React from "react"
import styled from "styled-components"
import { format } from "date-fns"

const Container = styled.div`
  position: relative;
  font-family: "Fira Code", "SF Mono", "Consolas", "Segoe UI", "Roboto", "-apple-system",
    "Helvetica Neue", sans-serif;
`
const LeftDateContainer = styled.span`
  color: ${props => props.theme.highlight};
`
const RightDateContainer = styled.span`
  color: ${props => props.theme.foreground};
`
const DeltaContainer = styled.span`
  color: ${props => props.theme.tag};
  font-size: 0.7rem;
  position: absolute;
  top: -12px;
  right: 0;
  left: 0;
`

interface Props {
  date: number | Date | string
  deltaTime?: number
}

export default function Timestamp({ date, deltaTime }: Props) {
  const fixedDate = typeof date === "string" ? new Date(date) : date

  const dateLeft = format(fixedDate, "h:mm:")
  const dateRight = format(fixedDate, "ss.SSS")
  const delta = deltaTime ? `+${deltaTime} ms` : ""

  return (
    <Container>
      <LeftDateContainer>{dateLeft}</LeftDateContainer>
      <RightDateContainer>{dateRight}</RightDateContainer>
      <DeltaContainer title="Since last Reactotron message">{delta}</DeltaContainer>
    </Container>
  )
}
