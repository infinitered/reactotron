import React, { FunctionComponent, useState } from "react"
import styled from "styled-components"
import { MdRepeat, MdCode } from "react-icons/md"
import stringifyObject from "stringify-object"
import type { Difference } from "reactotron-core-contract"

import TimelineCommand from "../../components/TimelineCommand"
import ContentView from "../../components/ContentView"
import { TimelineCommandProps, buildTimelineCommand } from "../BaseCommand"
import TreeViewDiff from "../../components/TreeViewDiff"

const NameContainer = styled.div`
  color: ${(props) => props.theme.bold};
  padding-bottom: 10px;
`
const TabContainer = styled.div`
  display: flex;
  padding-top: 8px;
  padding-bottom: 8px;
`
const TabItem = styled.div<{ $active: boolean }>`
  color: ${({ $active, theme }) => ($active ? theme.bold : theme.foregroundDark)};
  cursor: pointer;
  padding-right: 8px;
  padding-left: 8px;
  border-right: 1px solid ${(props) => props.theme.chromeLine};
  :last-child {
    border-right: none;
  }
  :first-child {
    padding-left: 0px;
  }
`
const Tab = styled.div`
  display: flex;
  padding: 10px;

  border-bottom: 1px solid ${({ theme }) => theme.chromeLine};
`

interface StateActionCompletePayload {
  name: string
  action: any
  diff?: Difference[]
}

interface Props extends TimelineCommandProps<StateActionCompletePayload> {}

const StateActionCompleteCommand: FunctionComponent<Props> = ({
  command,
  isOpen,
  setIsOpen,
  dispatchAction,
  openDispatchDialog,
}) => {
  const { payload, date, deltaTime } = command
  const [tabActive, setTabActive] = useState<"preview" | "diff">("preview")

  const toolbar = []

  if (dispatchAction) {
    toolbar.push({
      icon: MdRepeat,
      onClick: () => {
        dispatchAction(payload.action)
      },
      tip: "Repeat this action.",
    })
  }

  if (openDispatchDialog) {
    toolbar.push({
      icon: MdCode,
      onClick: () => {
        openDispatchDialog(
          stringifyObject(payload.action, {
            indent: "  ",
            singleQuotes: true,
          })
        )
      },
      tip: "Edit and dispatch this action.",
    })
  }

  return (
    <TimelineCommand
      date={date}
      deltaTime={deltaTime}
      title="ACTION"
      preview={payload.name}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      toolbar={toolbar}
    >
      <NameContainer>{payload.name}</NameContainer>
      {payload.diff != null && (
        <TabContainer>
          <Tab>
            <TabItem $active={tabActive === "preview"} onClick={() => setTabActive("preview")}>
              Preview
            </TabItem>
            <TabItem $active={tabActive === "diff"} onClick={() => setTabActive("diff")}>
              Diff
            </TabItem>
          </Tab>
        </TabContainer>
      )}
      {tabActive === "preview" && <ContentView value={payload.action} />}
      {tabActive === "diff" && <TreeViewDiff value={payload.diff} />}
    </TimelineCommand>
  )
}

export default buildTimelineCommand(StateActionCompleteCommand)
export { StateActionCompleteCommand }
