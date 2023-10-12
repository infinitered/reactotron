import React, { FunctionComponent } from "react"
import ReactModal from "react-modal"
import styled, { useTheme } from "styled-components"

ReactModal.setAppElement(document.body)

const Title = styled.h1`
  margin: 0;
  padding: 0;
  text-align: left;
  font-weight: normal;
  font-size: 24px;
  color: ${(props) => props.theme.heading};
`
const KeystrokesContainer = styled.div`
  display: flex;
  align-self: center;
  padding-top: 20px;
  font-size: 13px;
`
export const KeystrokeContainer = styled.div`
  padding: 0 10px;
`
export const Keystroke = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.backgroundHighlight};
  color: ${(props) => props.theme.foreground};
`

interface Props {
  isOpen: boolean
  onClose: () => void
  onAfterOpen?: () => void
  title: string
  additionalKeystrokes?: React.ReactNode
}

const Modal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  isOpen,
  onClose,
  onAfterOpen,
  title,
  children,
  additionalKeystrokes,
}) => {
  const theme = useTheme()

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: theme.modalOverlay,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          padding: 20,
          backgroundColor: theme.background,
          color: theme.foreground,
          borderColor: theme.backgroundLighter,
          width: 500,
          position: "auto" as any, // TODO: Fix this!
          top: "auto",
          bottom: "auto",
        },
      }}
    >
      <div>
        <Title>{title}</Title>
      </div>
      <div>{children}</div>
      <KeystrokesContainer>
        <KeystrokeContainer>
          <Keystroke>ESC</Keystroke> Close
        </KeystrokeContainer>
        {additionalKeystrokes}
      </KeystrokesContainer>
    </ReactModal>
  )
}

export default Modal
