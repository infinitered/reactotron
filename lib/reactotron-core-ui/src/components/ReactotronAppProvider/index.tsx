import React from "react"
import styled, { ThemeProvider } from "styled-components"

import useColorScheme from "../../hooks/useColorScheme"
import { themes } from "../../themes"

const ReactotronContainer = styled.div`
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 0.94em;
  width: 100%;
  height: 100%;
  user-select: none;
`

const ReactotronAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider theme={themes[colorScheme]}>
      <ReactotronContainer>{children}</ReactotronContainer>
    </ThemeProvider>
  )
}

export default ReactotronAppProvider
