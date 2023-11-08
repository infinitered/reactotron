import React from "react"
import styled, { ThemeProvider } from "rn-css"

import theme from "../../theme"

const ReactotronContainer = styled.View`
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 0.94em;
  width: 100%;
  height: 100%;
  user-select: none;
`

const ReactotronAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <ReactotronContainer>{children}</ReactotronContainer>
    </ThemeProvider>
  )
}

export default ReactotronAppProvider
