import React from "react"
import JSONTree from "react-json-tree"
import styled from "styled-components"

import Theme from "../theme"

const MutedContainer = styled.span`
  color: ${props => props.theme.highlight};
`

const treeTheme = {
  ...Theme,
  base0B: Theme.foreground,
  tree: { backgroundColor: "transparent", marginTop: -3 },
}

interface Props {
  value: object
  level?: number
}

export default function TreeView({ value, level = 1 }: Props) {
  return (
    <JSONTree
      data={value}
      hideRoot
      shouldExpandNode={(keyName, data, minLevel) => minLevel <= level}
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
