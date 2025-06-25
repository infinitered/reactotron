import React from "react"
import { JSONTree } from "react-json-tree"
import styled from "styled-components"

import useColorScheme from "../../hooks/useColorScheme"
import { type ReactotronTheme, themes } from "../../themes"

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

const HighlightedText = styled.span`
  background: ${(props) => {
    const theme = props.theme
    return theme.colorScheme === 'dark' 
      ? `linear-gradient(135deg, ${theme.keyword}20, ${theme.string}20)`
      : `linear-gradient(135deg, ${theme.keyword}15, ${theme.string}15)`
  }};
  color: ${(props) => props.theme.foreground};
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid ${(props) => {
    const theme = props.theme
    return theme.colorScheme === 'dark' 
      ? `${theme.keyword}40`
      : `${theme.keyword}30`
  }};
  box-shadow: ${(props) => {
    const theme = props.theme
    return theme.colorScheme === 'dark'
      ? `0 1px 3px ${theme.keyword}20, inset 0 1px 0 ${theme.keyword}10`
      : `0 1px 2px ${theme.keyword}15, inset 0 1px 0 ${theme.keyword}05`
  }};
  text-shadow: ${(props) => {
    const theme = props.theme
    return theme.colorScheme === 'dark'
      ? `0 1px 2px ${theme.background}`
      : `0 1px 1px ${theme.background}`
  }};
`

function highlightText(text: string, searchTerm: string) {
  if (!searchTerm.trim() || !text) return text
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  let keyCounter = 0
  return parts.map((part) => {
    if (regex.test(part)) {
      keyCounter++
      return <HighlightedText key={`highlight-${text}-${keyCounter}-${part}`}>{part}</HighlightedText>
    }
    return part
  })
}

const getTreeTheme = (baseTheme: ReactotronTheme) => ({
  tree: { backgroundColor: "transparent", marginTop: -3 },
  ...theme,
  base0B: baseTheme.foreground,
})

interface Props {
  // value: object
  value: any
  level?: number
  searchTerm?: string
}

export default function TreeView({ value, level = 1, searchTerm = "" }: Props) {
  const colorScheme = useColorScheme()

  const labelRenderer = (keyPath: (string | number)[]) => {
    const key = keyPath[0]
    const text = String(key)
    
    if (typeof key === 'string' && searchTerm) {
      return highlightText(text, searchTerm)
    }
    
    return <span>{text}</span>
  }

  const valueRenderer = (transformed: any, untransformed: any) => {
    const text = `${untransformed || transformed}`
    return <span>{text}</span>
  }

  return (
    <JSONTree
      data={value}
      hideRoot
      shouldExpandNodeInitially={(keyName, data, minLevel) => minLevel <= level}
      theme={getTreeTheme(themes[colorScheme])}
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
      labelRenderer={labelRenderer}
      valueRenderer={valueRenderer}
    />
  )
}
