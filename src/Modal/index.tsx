import React, { FunctionComponent, useContext } from "react"
import ReactModal from "react-modal"
import styled, { ThemeContext } from "styled-components"

ReactModal.setAppElement(document.body);

const Title = styled.h1`
  margin: 0;
  padding: 0;
  text-align: left;
  font-weight: normal;
  font-size: 24px;
  color: ${props => props.theme.heading};
`
const KeystrokesContainer = styled.div`
  display: flex;
  align-self: center;
  padding-top: 20px;
  font-size: 13px;
`
const KeystrokeContainer = styled.div`
  padding: 0 10px;
`
const Keystroke = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => props.theme.backgroundHighlight};
  color: ${props => props.theme.foreground};
`

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
}

const Modal: FunctionComponent<Props> = ({ isOpen, onClose, title, children }) => {
  const themeContext = useContext(ThemeContext)

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: themeContext.modalOverlay,
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
          backgroundColor: themeContext.background,
          color: themeContext.foreground,
          borderColor: themeContext.backgroundLighter,
          width: 500,
          position: "auto",
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
          <Keystroke>ESC</Keystroke> Escape
        </KeystrokeContainer>
      </KeystrokesContainer>
    </ReactModal>
  )
}

export default Modal
