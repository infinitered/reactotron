import React from "react"
import { JSONTree } from "react-json-tree"
import styled from "styled-components"

import baseTheme from "../../theme"

// TODO: Ripping this right from reactotron right now... should probably be better.
const theme = {
  author: "david hart (http://hart-dev.com)",
  base0A: "#f9ee98",
  base0B: "#8f9d6a",
  base0C: "#afc4db",
  base0D: "#7587a6",
  base0E: "#9b859d",
  base0F: "#9b703f",
  base00: "#1e1e1e",
  base01: "#323537",
  base02: "#464b50",
  base03: "#5f5a60",
  base04: "#838184",
  base05: "#a7a7a7",
  base06: "#c3c3c3",
  base07: "#ffffff",
  base08: "#cf6a4c",
  base09: "#cda869",
  scheme: "twilight",
}

const MutedContainer = styled.span`
  color: ${(props) => props.theme.highlight};
`

const treeTheme = {
  tree: { backgroundColor: "transparent", marginTop: -3 },
  ...theme,
  base0B: baseTheme.foreground,
}

interface Props {
  // value: object
  value: any
  level?: number
}

export default function TreeView({ value, level = 1 }: Props) {
  return (
    <JSONTree
      data={value}
      hideRoot
      shouldExpandNodeInitially={(keyName, data, minLevel) => minLevel <= level}
      theme={treeTheme}
      getItemString={(type, data, itemType, itemString) => {
        if (type === "Object") {
          return <MutedContainer>{itemType}</MutedContainer>
        }

        return (
          <MutedContainer>
            {itemType} {itemString}
          </MutedContainer>
        )
      }}
      valueRenderer={(transformed, untransformed) => {
        return <span>{`${untransformed || transformed}`}</span>
      }}
    />
  )
}
