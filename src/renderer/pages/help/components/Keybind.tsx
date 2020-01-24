import React, { Fragment } from "react"
import styled from "styled-components"

const platform = window.process.platform
const mouseTrap = platform === "darwin" ? "command" : "ctrl"

const KEY_REMAPS = {
  command: "⌘",
  ctrl: "CTRL",
  shift: "⬆",
}

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  color: ${props => props.theme.foreground};
`

interface KeystrokeContainerProps {
  addWidth: boolean
}
const KeystrokeContainer = styled.div<KeystrokeContainerProps>`
  width: ${props => (props.addWidth ? "180px" : "auto")};
`
const Keystroke = styled.span`
  font-weight: bold;
  padding: 4px 12px;
  margin: 0 2px;
  background-color: ${props => props.theme.foreground};
  color: ${props => props.theme.background};
  border-radius: 4px;
  border-bottom: 2px solid ${props => props.theme.highlight};
`
const Plus = styled.span`
  margin: 0 2px;
`

const Description = styled.div``

export function KeybindKeys({ keybind, sequence, addWidth }) {
  // const modifierName = platform === "darwin" ? "⌘" : "CTRL"
  const splitSequence = sequence.split("+")

  return (
    <KeystrokeContainer addWidth={addWidth}>
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
  return keybind.sequences.find(s => s.sequence.indexOf(mouseTrap) > -1).sequence
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
