import type { CustomCommand } from "reactotron-core-ui"
import React, { useReducer } from "react"
import {
  CustomCommandItemState,
  CustomCommandItemActionType,
  customCommandItemReducer,
  customCommandItemReducerInitializer,
} from "../reducers/customCommandItemReducer"
import styled from "styled-components"

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 24px;
  color: ${(props) => props.theme.foreground};
`
const Title = styled.div`
  font-size: 24px;
  margin-bottom: 12px;
`
const Description = styled.div`
  margin-bottom: 12px;
`
const ArgsContainer = styled.div`
  margin-bottom: 24px;
`
const SendButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.backgroundLighter};
  border-radius: 4px;
  width: 200px;
  min-height: 50px;
  margin-bottom: 24px;
  cursor: pointer;
  color: white;
  transition: background-color 0.25s ease-in-out;

  &:hover {
    background-color: #e73435;
  }
`
const ArgContainer = styled.div`
  &:not(:last-child) {
    margin-bottom: 12px;
  }
`
const ArgName = styled.div`
  margin-bottom: 8px;
`
const ArgInput = styled.input`
  padding: 10px 12px;
  outline: none;
  border-radius: 4px;
  width: 90%;
  border: none;
  font-size: 16px;
`

export default function CustomCommandItem({
  customCommand,
  sendCustomCommand,
}: {
  customCommand: CustomCommand
  sendCustomCommand: (command: string, args: CustomCommandItemState) => void
}) {
  const [state, dispatch] = useReducer(
    customCommandItemReducer,
    customCommand.args,
    customCommandItemReducerInitializer
  )

  const handleArgInputChange = (argName: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: CustomCommandItemActionType.UPDATE_ARG,
        payload: {
          argName,
          value: event.target.value,
        },
      })
    }
  }

  return (
    <ButtonContainer>
      <Title>{customCommand.title || customCommand.command}</Title>
      <Description>{customCommand.description || "No Description Provided"}</Description>
      {!!customCommand.args && customCommand.args.length > 0 && (
        <ArgsContainer>
          {customCommand.args.map((arg) => {
            const hidden = arg.hidden || false
            return (
              <ArgContainer key={arg.name}>
                <ArgName>{arg.name}</ArgName>
                <ArgInput
                  type={hidden ? "password" : "text"}
                  placeholder={arg.placeholder ?? arg.name}
                  value={state[arg.name]}
                  onChange={handleArgInputChange(arg.name)}
                />
              </ArgContainer>
            )
          })}
        </ArgsContainer>
      )}
      <SendButton
        onClick={() => {
          sendCustomCommand(customCommand.command, state)
        }}
      >
        Send Command
      </SendButton>
    </ButtonContainer>
  )
}
