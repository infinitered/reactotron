import React, { FunctionComponent } from "react"
import styled from "styled-components"

import TimelineCommand from "../../components/TimelineCommand"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"

const NameContainer = styled.div`
  color: ${props => props.theme.bold};
  padding-bottom: 10px;
`

const StepContainer = styled.div`
  position: relative;
  display: flex;
  color: ${props => props.theme.foreground};
  margin: 2px 0;
  padding: 4px;
`
const StepTitle = styled.div`
  flex: 1;
  word-break: break-all;
  z-index: 2;
`
const StepDuration = styled.div`
  text-align: right;
  width: 100px;
  z-index: 2;
`
interface StepGrapProps {
  startPercent: number
  endPercent: number
}
const StepGraph = styled.div<StepGrapProps>`
  background-color: ${props => props.theme.backgroundLighter};
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${props => props.startPercent}%;
  right: ${props => props.endPercent}%;
`

interface BenchmarkReportPayload {
  title: string
  steps: {
    title: string
    time: number
    delta: number
  }[]
}

interface Props extends TimelineCommandProps<BenchmarkReportPayload> {}

const BenchmarkReportCommand: FunctionComponent<Props> = ({ command, isOpen, setIsOpen }) => {
  const { payload, date, deltaTime } = command

  const totalDuration = payload.steps[payload.steps.length - 1].time

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title="BENCHMARK"
      preview={`${payload.title} in ${(totalDuration / 1000).toFixed(3)}s`}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <NameContainer>{payload.title}</NameContainer>
      {payload.steps.map((step, idx) => {
        if (idx === 0) return null

        const startPercent = Number((((step.time - step.delta) / totalDuration) * 100).toFixed(0))
        const endPercent = 100 - Number(((step.time / totalDuration) * 100).toFixed(0))

        return (
          <StepContainer key={idx}>
            <StepGraph startPercent={startPercent} endPercent={endPercent} />
            <StepTitle>{step.title}</StepTitle>
            <StepDuration>{(step.delta / 1000).toFixed(3)}s</StepDuration>
          </StepContainer>
        )
      })}
    </TimelineCommand>
  )
}

export default buildTimelineCommand(BenchmarkReportCommand)
export { BenchmarkReportCommand }
