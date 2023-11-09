import React from "react"
import styled from "rn-css"

import Keybind from "./Keybind"

const Contianer = styled.View`
  flex-direction: column;
  margin-bottom: 35px;
`

const Name = styled.View`
  color: ${(props) => props.theme.highlight};
`

const KeybindContainer = styled.View`
  flex-direction: column;
`

function KeybindGroup({ group }) {
  return (
    <Contianer>
      <Name>{group.name}</Name>
      <KeybindContainer>
        {group.keybinds.map((keybind) => (
          <Keybind key={`${group.name}-${keybind.name}`} keybind={keybind} />
        ))}
      </KeybindContainer>
    </Contianer>
  )
}

export default KeybindGroup
