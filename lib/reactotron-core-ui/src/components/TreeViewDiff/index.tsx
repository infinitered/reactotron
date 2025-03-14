import React, { ReactElement, type ReactNode } from "react"
import { JSONTree, type ValueRenderer } from "react-json-tree"
import styled from "styled-components"

import useColorScheme from "../../hooks/useColorScheme"
import { ReactotronTheme, themes } from "../../themes"
import type { Difference } from "reactotron-core-contract"

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

const RemovedValue = styled.span`
  color: ${(props) => props.theme.delete};
  text-decoration: line-through;
  margin-right: 4px;
`
const NewValue = styled.span`
  color: ${(props) => props.theme.string};
`

const getTreeTheme = (baseTheme: ReactotronTheme) => ({
  tree: { backgroundColor: "transparent", marginTop: -3 },
  ...theme,
  base0B: baseTheme.foreground,
})

interface Props {
  value?: Difference[]
  level?: number
}

export default function TreeViewDiff({ value, level = 1 }: Props): ReactElement | null {
  const colorScheme = useColorScheme()
  if (value == null || value.length === 0) return null

  const mappedValues: Record<string, ReactNode> = value.reduce((acc, diff) => {
    if (diff.type === "CHANGE") {
      acc[diff.path.join(".")] = (
        <span>
          <RemovedValue>{JSON.stringify(diff.oldValue)}</RemovedValue>
          <NewValue>{JSON.stringify(diff.value)}</NewValue>
        </span>
      )
      return acc
    }
    if (diff.type === "CREATE") {
      acc[diff.path.join(".")] = <NewValue>{JSON.stringify(diff.value)}</NewValue>

      return acc
    }
    if (diff.type === "REMOVE") {
      acc[diff.path.join(".")] = <RemovedValue>{JSON.stringify(diff.oldValue)}</RemovedValue>
      return acc
    }
    return acc
  }, {})

  const treeData: Record<string, string> = value.reduce((acc, diff) => {
    acc[diff.path.join(".")] = diff.path.join(".")
    return acc
  }, {})

  const valueRenderer: ValueRenderer = (_, untransformed) => {
    const mappedValue = mappedValues[untransformed as string]
    return mappedValue
  }

  return (
    <JSONTree
      data={treeData}
      hideRoot
      shouldExpandNodeInitially={(_keyName, _data, minLevel) => minLevel <= level}
      theme={getTreeTheme(themes[colorScheme])}
      valueRenderer={valueRenderer}
    />
  )
}
