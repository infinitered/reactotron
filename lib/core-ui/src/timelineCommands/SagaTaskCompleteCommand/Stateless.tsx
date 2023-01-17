import React, { FunctionComponent } from "react"
import styled from "styled-components"
import {
  MdList,
  MdDone as IconStatusResolved,
  MdEject as IconStatusCancelled,
  MdError as IconStatusRejected,
} from "react-icons/md"

import TimelineCommand from "../../components/TimelineCommand"
import ContentView from "../../components/ContentView"
import { TimelineCommandProps } from "../BaseCommand"

const STATUS_MAP = {
  RESOLVED: <IconStatusResolved size={18} />,
  REJECTED: <IconStatusRejected />,
  CANCELLED: <IconStatusCancelled />,
}

const EffectTitle = styled.div`
  display: flex;
  color: ${props => props.theme.foreground};
  border-bottom: 1px solid ${props => props.theme.highlight};
  padding-bottom: 4px;
  margin-bottom: 4px;
`
const TriggerType = styled.div`
  color: ${props => props.theme.tag};
  padding-right: 20px;
`
const Duration = styled.div`
  text-align: right;
  flex: 1;
`
const DurationMs = styled.span`
  color: ${props => props.theme.foregroundDark};
`

const EffectContainer = styled.div`
  display: flex;
  color: ${props => props.theme.foreground};
  padding-top: 4px;
  margin-top: 2px;
  border-bottom: 1px solid ${props => props.theme.subtleLine};
`
const EffectNameContainer = styled.div`
  width: 140px;
  align-items: center;
  margin-bottom: 4px;
`
interface EffectNameProps {
  depth: number
  isLoser: boolean
}
const EffectName = styled.span<EffectNameProps>`
  color: ${props => (props.isLoser ? props.theme.foregroundDark : props.theme.constant)};
  padding-left: ${props => props.depth * 20}px;
  text-decoration: ${props => (props.isLoser ? "line-through" : "")};
`
const EffectStatus = styled.span`
  color: ${props => props.theme.tag};
  padding-right: 4px;
`
const EffectExtraContainer = styled.div`
  flex: 1;
`
const EffectDescription = styled.div`
  padding-bottom: 4px;
`

export interface SagaTaskCompleteChild {
  depth: number
  description: string
  duration: number
  effectId: number
  extra: { type: string }
  name: string
  parentEffectId: number
  result: { type: string }
  status: string
  winner: any
  loser: any
}

export interface SagaTaskCompletePayload {
  children: SagaTaskCompleteChild[]
  description: any // TODO: ¯\_(ツ)_/¯
  duration: number
  triggerType: string
}

interface Props extends TimelineCommandProps<SagaTaskCompletePayload> {
  isDetailsOpen: boolean
  setIsDetailsOpen: (isDetailsOpen: boolean) => void
}

function buildToolbar(isDetailsOpen: boolean, setIsDetailsOpen: (isDetailsOpen: boolean) => void) {
  const toolbarItems = []

  toolbarItems.push({
    icon: MdList,
    onClick: () => {
      setIsDetailsOpen(!isDetailsOpen)
    },
    tip: "Toggle saga details",
  })

  return toolbarItems
}

function renderEffect(effect: SagaTaskCompleteChild, isDetailsOpen: boolean) {
  const { extra, loser, status, name, description, duration, depth, result } = effect

  return (
    <EffectContainer key={`effect-${effect.effectId}`}>
      <EffectNameContainer>
        <EffectName depth={depth} isLoser={loser || status === "CANCELLED"}>
          <EffectStatus>{STATUS_MAP[status]}</EffectStatus>
          {name}
        </EffectName>
      </EffectNameContainer>
      <EffectExtraContainer>
        {extra && (
          <>
            <EffectDescription>{description}</EffectDescription>
            {isDetailsOpen && <ContentView value={{ in: extra, out: result }} treeLevel={0} />}
          </>
        )}
      </EffectExtraContainer>
      <Duration>
        {duration}
        <DurationMs>ms</DurationMs>
      </Duration>
    </EffectContainer>
  )
}

const SagaTaskCompleteCommand: FunctionComponent<Props> = ({
  command,
  isOpen,
  setIsOpen,
  isDetailsOpen,
  setIsDetailsOpen,
}) => {
  const { payload, date, deltaTime } = command

  const toolbar = buildToolbar(isDetailsOpen, setIsDetailsOpen)

  const effectTitle = `${payload.children.length} Effect${payload.children.length === 1 ? "" : "s"}`

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title="SAGA"
      preview={`${payload.triggerType} in ${payload.duration}ms`}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      toolbar={toolbar}
    >
      <EffectTitle>
        <TriggerType>{payload.description || payload.triggerType}</TriggerType>
        {effectTitle}
        <Duration>
          {payload.duration}
          <DurationMs>ms</DurationMs>
        </Duration>
      </EffectTitle>
      {payload.children.map(effect => renderEffect(effect, isDetailsOpen))}
    </TimelineCommand>
  )
}

export default SagaTaskCompleteCommand
