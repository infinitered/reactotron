import React, { FunctionComponent, useRef, useState, useCallback } from "react"
import styled from "styled-components"

import Modal, { KeystrokeContainer, Keystroke } from "../../components/Modal"

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
`
const NameLabel = styled.label`
  font-size: 13px;
  color: ${(props) => props.theme.heading};
`
const NameInput = styled.input`
  border: 0;
  border-bottom: 1px solid ${(props) => props.theme.line};
  font-size: 25px;
  color: ${(props) => props.theme.foregroundLight};
  line-height: 40px;
  background-color: inherit;
`

interface Props {
  snapshot: any // TODO: Type this better when we sort out the typings
  isOpen: boolean
  onClose: () => void
  onRenameSnapshot: (name: string) => void
}

const SnapshotAddModal: FunctionComponent<Props> = ({
  snapshot,
  isOpen,
  onClose,
  onRenameSnapshot,
}) => {
  const [name, setName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAfterOpen = () => {
    setName((snapshot || {}).name || "")
    inputRef.current && inputRef.current.focus()
  }

  const handleClose = useCallback(() => {
    setName("")
    onClose()
  }, [onClose])

  const handleChange = useCallback((e) => {
    setName(e.target.value)
  }, [])

  const handleKeypress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        onRenameSnapshot(name)
        setName("")
      }
    },
    [onRenameSnapshot, name]
  )

  return (
    <Modal
      title="Rename Snapshot"
      isOpen={isOpen}
      onClose={handleClose}
      onAfterOpen={handleAfterOpen}
      additionalKeystrokes={
        <KeystrokeContainer>
          <Keystroke>ENTER</Keystroke> Save
        </KeystrokeContainer>
      }
    >
      <NameContainer>
        <NameLabel>NAME</NameLabel>
        <NameInput
          type="text"
          ref={inputRef}
          value={name}
          onChange={handleChange}
          onKeyPress={handleKeypress}
        />
      </NameContainer>
    </Modal>
  )
}

export default SnapshotAddModal
