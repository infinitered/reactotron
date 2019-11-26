import React, { FunctionComponent, useRef, useState, useCallback, useEffect } from "react"
import styled from "styled-components"

import Modal, { KeystrokeContainer, Keystroke } from "../Modal"

const InstructionText = styled.div`
  text-align: left;
  color: ${props => props.theme.foreground};
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
`
const ActionLabel = styled.label`
  font-size: 13px;
  color: ${props => props.theme.heading};
`
const ActionInput = styled.textarea`
  border: 0;
  border-bottom: 1px solid ${props => props.theme.line};
  font-size: 25px;
  color: ${props => props.theme.foregroundLight};
  line-height: 40px;
  background-color: inherit;
  min-width: 462px;
  max-width: 462px;
  height: 150px;
  min-height: 40px;
  max-height: 300px;
`

interface Props {
  isOpen: boolean
  initialValue?: string
  onClose: () => void
  onDispatchAction: (action: string) => void
}

const DispatchActionModal: FunctionComponent<Props> = ({
  isOpen,
  initialValue,
  onClose,
  onDispatchAction,
}) => {
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [action, setAction] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && !prevIsOpen) {
      setAction(initialValue)
    }

    setPrevIsOpen(isOpen)
  }, [isOpen])

  const handleAfterOpen = () => inputRef.current && inputRef.current.focus()

  const handleKeypress = e => {
    if (e.keyCode === 13 && e.metaKey) {
      // We need to take a string that is not exactly JSON and make it an object.
      const actualAction = eval(`(${action})`) // eslint-disable-line

      onDispatchAction(actualAction)
      setAction("")
      onClose()
    }
  }

  const handleClose = useCallback(() => {
    setAction("")
    onClose()
  }, [])

  const handleChange = useCallback(e => {
    setAction(e.target.value)
  }, [])

  return (
    <Modal
      title="Dispatch Action"
      isOpen={isOpen}
      onClose={handleClose}
      onAfterOpen={handleAfterOpen}
      additionalKeystrokes={
        <KeystrokeContainer>
          <Keystroke>ENTER</Keystroke> Dispatch
        </KeystrokeContainer>
      }
    >
      <InstructionText>
        <p>Create an action that will be dispatched to the client to run.</p>
      </InstructionText>
      <ActionContainer>
        <ActionLabel>ACTION</ActionLabel>
        <ActionInput
          ref={inputRef}
          value={action}
          onChange={handleChange}
          placeholder="{ type: 'RepoMessage.Request' }"
          onKeyDown={handleKeypress}
        />
      </ActionContainer>
    </Modal>
  )
}

export default DispatchActionModal
