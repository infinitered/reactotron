import React, { FunctionComponent, useRef, useState, useCallback, useEffect } from "react"
import styled from "styled-components"

import Modal, { KeystrokeContainer, Keystroke } from "../../components/Modal"
import { ApolloClientCacheUpdatePayload } from "reactotron-core-contract"

const KEY_MAPS = {
  command: "⌘",
  ctrl: "CTRL",
}

const InstructionText = styled.div`
  text-align: left;
  color: ${(props) => props.theme.foreground};
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
`
const ActionLabel = styled.label`
  font-size: 13px;
  color: ${(props) => props.theme.heading};
  padding-bottom: 20px;
`
const ActionInput = styled.textarea`
  border: 0;
  border-bottom: 1px solid ${(props) => props.theme.line};
  font-size: 25px;
  color: ${(props) => props.theme.foregroundLight};
  line-height: 40px;
  background-color: inherit;
  min-width: 462px;
  max-width: 462px;
  height: 150px;
  min-height: 40px;
  max-height: 300px;
`

const isDarwin = process.platform === "darwin"

interface Props {
  isOpen: boolean
  initialValue?: ApolloClientCacheUpdatePayload
  onClose: () => void
  onDispatchAction: (updates: ApolloClientCacheUpdatePayload) => void
  cacheKey: string
}

const ApolloUpdateCacheValueModal: FunctionComponent<Props> = ({
  isOpen,
  initialValue,
  onClose,
  onDispatchAction,
  cacheKey,
}) => {
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [action, setAction] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && !prevIsOpen) {
      setAction(initialValue.fieldValue)
    }

    setPrevIsOpen(isOpen)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleAfterOpen = () => inputRef.current && inputRef.current.focus()

  const handleKeypress = (e) => {
    if (e.keyCode === 13 && e.metaKey) {
      // TODO check whether we had an original number, boolean or string type?
      const newUpdates = { ...initialValue, fieldValue: action }
      onDispatchAction(newUpdates)
      setAction("")
      onClose()
    }
  }

  const handleClose = useCallback(() => {
    setAction("")
    onClose()
  }, [onClose])

  const handleChange = useCallback((e) => {
    setAction(e.target.value)
  }, [])

  return (
    <Modal
      title="Update Cache Field"
      isOpen={isOpen}
      onClose={handleClose}
      onAfterOpen={handleAfterOpen}
      additionalKeystrokes={
        <KeystrokeContainer>
          <Keystroke>{isDarwin ? KEY_MAPS.command : KEY_MAPS.ctrl} + ENTER</Keystroke> Update
        </KeystrokeContainer>
      }
    >
      <InstructionText>
        <p>Modify the field for the following cache key:</p>
      </InstructionText>
      <ActionContainer>
        <ActionLabel>
          Cache ID: {cacheKey} | Property: {initialValue.fieldName}
        </ActionLabel>
        {/* TODO string = input type text, number = input type number. boolean type checkbox */}
        <ActionInput
          ref={inputRef}
          value={action}
          onChange={handleChange}
          onKeyDown={handleKeypress}
        />
      </ActionContainer>
    </Modal>
  )
}

export default ApolloUpdateCacheValueModal
