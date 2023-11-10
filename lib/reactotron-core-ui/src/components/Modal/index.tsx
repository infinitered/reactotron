import React, { FunctionComponent } from "react"
import { Pressable, Modal as RNModal } from "react-native"
import styled, { useTheme } from "rn-css"

const Title = styled.Text`
  color: ${(props) => props.theme.heading};
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 24px;
  font-weight: normal;
  margin: 0;
  padding: 0;
  text-align: left;
`
const KeystrokesContainer = styled.View`
  align-items: center;
  align-self: center;
  flex-direction: row;
  justify-content: center;
  padding-top: 20px;
`
export const KeystrokeContainer = styled.View`
  flex-direction: row;
  padding: 0 10px;
`
export const Keystroke = styled.Text`
  background-color: ${(props) => props.theme.backgroundHighlight};
  border-radius: 4px;
  color: ${(props) => props.theme.foreground};
  font-family: ${(props) => props.theme.fontFamily};
  padding: 4px 8px;
`
const Close = styled.Text`
  color: ${(props) => props.theme.foreground};
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 13px;
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
    <RNModal onDismiss={onClose} onShow={onAfterOpen} transparent visible={isOpen}>
      <Pressable
        onPress={onClose}
        style={{
          alignItems: "center",
          backgroundColor: theme.modalOverlay,
          flex: 1,
          justifyContent: "center",
          padding: 40,
        }}
      >
        <Pressable
          style={{
            backgroundColor: theme.background,
            borderColor: theme.backgroundLighter,
            borderRadius: 4,
            bottom: "auto",
            color: theme.foreground,
            flexDirection: "column",
            padding: 20,
            position: "auto" as any, // TODO: Fix this!
            top: "auto",
            width: 500,
          }}
        >
          <Title>{title}</Title>
          {children}
          <KeystrokesContainer>
            <KeystrokeContainer>
              <Keystroke>ESC</Keystroke> <Close>Close</Close>
            </KeystrokeContainer>
            {additionalKeystrokes}
          </KeystrokesContainer>
        </Pressable>
      </Pressable>
    </RNModal>
  )
}

export default Modal
