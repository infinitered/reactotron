import React from "react"
import styled from "styled-components"

import Keybind from "./Keybind"

const Contianer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 35px;
`

const Name = styled.div`
  color: ${props => props.theme.highlight};
`

const KeybindContainer = styled.div`
  display: flex;
  flex-direction: column;
`

function KeybindGroup({ group }) {
  return (
    <Contianer>
      <Name>{group.name}</Name>
      <KeybindContainer>
        {group.keybinds.map(keybind => (
          <Keybind key={`${group.name}-${keybind.name}`} keybind={keybind} />
        ))}
      </KeybindContainer>
    </Contianer>
  )
}

export default KeybindGroup
