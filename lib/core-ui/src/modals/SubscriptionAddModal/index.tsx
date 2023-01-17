import React, { FunctionComponent, useRef, useState, useCallback } from "react"
import styled from "styled-components"

import Modal, { KeystrokeContainer, Keystroke } from "../../components/Modal"

const InstructionText = styled.div`
  text-align: left;
  color: ${props => props.theme.foreground};
`
const ExampleText = styled.p`
  margin: 0 0 0 40px;
  color: ${props => props.theme.bold};
`

const PathContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
`
const PathLabel = styled.label`
  font-size: 13px;
  color: ${props => props.theme.heading};
`
const PathInput = styled.input`
  border: 0;
  border-bottom: 1px solid ${props => props.theme.line};
  font-size: 25px;
  color: ${props => props.theme.foregroundLight};
  line-height: 40px;
  background-color: inherit;
`

interface Props {
  isOpen: boolean
  onClose: () => void
  onAddSubscription: (path: string) => void
}

const SubscriptionAddModal: FunctionComponent<Props> = ({ isOpen, onClose, onAddSubscription }) => {
  const [path, setPath] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAfterOpen = () => inputRef.current && inputRef.current.focus()

  const handleClose = useCallback(() => {
    setPath("")
    onClose()
  }, [onClose])

  const handleChange = useCallback(e => {
    setPath(e.target.value)
  }, [])

  const handleKeypress = useCallback(
    e => {
      if (e.key === "Enter") {
        onAddSubscription(path)
        setPath("")
      }
    },
    [onAddSubscription, path]
  )

  return (
    <Modal
      title="Add Subscription"
      isOpen={isOpen}
      onClose={handleClose}
      onAfterOpen={handleAfterOpen}
      additionalKeystrokes={
        <KeystrokeContainer>
          <Keystroke>ENTER</Keystroke> Subscribe
        </KeystrokeContainer>
      }
    >
      <InstructionText>
        <p>Enter a path you would like to subscribe. Here are some examples to get you started:</p>
        <ExampleText>user.firstName</ExampleText>
        <ExampleText>repo</ExampleText>
        <ExampleText>repo.*</ExampleText>
      </InstructionText>
      <PathContainer>
        <PathLabel>PATH</PathLabel>
        <PathInput
          type="text"
          ref={inputRef}
          value={path}
          onChange={handleChange}
          onKeyPress={handleKeypress}
        />
      </PathContainer>
    </Modal>
  )
}

export default SubscriptionAddModal
