import React, { FunctionComponent, useCallback, useEffect } from "react"
import styled from "styled-components"

import Modal, { Keystroke, KeystrokeContainer } from "../../components/Modal"


const Heading = styled.div`
  font-size: 18px;
  margin: 18px 0 10px;
  padding-bottom: 2px;
  border-bottom: 1px solid ${(props) => props.theme.highlight};
  color: ${(props) => props.theme.foregroundLight};
`

const Content = styled.div`
  margin-top: 10px;
  color: ${(props) => props.theme.string};
`

interface Props {
  isOpen: boolean
  onClose: () => void
  port: string
  serverStatusText: string
  onRefresh: () => void
}

const DiagnosticModal: FunctionComponent<Props> = ({ isOpen, onClose, port, serverStatusText, onRefresh }) => {

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    function onKeyPress(e: KeyboardEvent) {
      if (e.key === "Enter") {
        onRefresh ()
      }
    }

    addEventListener("keypress", onKeyPress);

    return () => {
      removeEventListener("keypress", onKeyPress);
    }
  }, [onRefresh])

  return (
    <Modal
      title="Diagnostics"
      isOpen={isOpen}
      onClose={handleClose}
      additionalKeystrokes={
        <KeystrokeContainer >
          <Keystroke>ENTER</Keystroke> Refresh Connection
        </KeystrokeContainer>
      }
    >
      <Heading>Port</Heading>
      <Content>{port || "n/a"}</Content>

      <Heading>Server Status</Heading>
      <Content>{serverStatusText}</Content>
    </Modal>
  )
}

export default DiagnosticModal
