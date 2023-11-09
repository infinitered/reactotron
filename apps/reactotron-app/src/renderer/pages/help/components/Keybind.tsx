import React, { Fragment } from "react"
import styled from "rn-css"

const platform = window.process.platform
const mouseTrap = platform === "darwin" ? "command" : "ctrl"

const KEY_REMAPS = {
  command: "⌘",
  ctrl: "CTRL",
  shift: "⬆",
}

const Container = styled.View`
  align-items: center;
  color: ${(props) => props.theme.foreground};
  flex-direction: row;
  margin: 10px 0;
`

interface KeystrokeContainerProps {
  $addWidth: boolean
}
const KeystrokeContainer = styled.View<KeystrokeContainerProps>`
  flex-direction: row;
  width: ${(props) => (props.$addWidth ? "180px" : "auto")};
`
const Keystroke = styled.Text`
  background-color: ${(props) => props.theme.foreground};
  border-bottom: 2px solid ${(props) => props.theme.highlight};
  border-radius: 4px;
  color: ${(props) => props.theme.background};
  font-weight: bold;
  margin: 0 2px;
  padding: 4px 12px;
`
const Plus = styled.Text`
  margin: 0 2px;
`

const Description = styled.View``

export function KeybindKeys({ keybind, sequence, addWidth }) {
  // const modifierName = platform === "darwin" ? "⌘" : "CTRL"
  const splitSequence = sequence.split("+")

  return (
    <KeystrokeContainer $addWidth={addWidth}>
      {splitSequence.map((key, idx) => (
        <Fragment key={`${keybind.name}-${idx}`}>
          <Keystroke>{KEY_REMAPS[key.toLowerCase()] || key.toLowerCase()}</Keystroke>
          {idx < splitSequence.length - 1 && <Plus>+</Plus>}
        </Fragment>
      ))}
    </KeystrokeContainer>
  )
}

export function getPlatformSequence(keybind) {
  if (keybind.sequences.length === 1) {
    return keybind.sequences[0].sequence
  }

  // If there is more then one we assume its platform specific
  return keybind.sequences.find((s) => s.sequence.indexOf(mouseTrap) > -1).sequence
}

function Keybind({ keybind }) {
  const platformSequence = getPlatformSequence(keybind)

  return (
    <Container>
      <KeybindKeys keybind={keybind} sequence={platformSequence} addWidth />
      <Description>{keybind.name}</Description>
    </Container>
  )
}

export default Keybind
