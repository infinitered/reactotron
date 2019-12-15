import React, { FunctionComponent } from "react"
import styled, { ThemeProvider } from "styled-components"

import theme from "../../theme"

const ReactotronContainer = styled.div`
  font-family: ${props => props.theme.fontFamily};
  width: 100%;
  height: 100%;
`

const ReactotronProvider: FunctionComponent = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <ReactotronContainer>{children}</ReactotronContainer>
    </ThemeProvider>
  )
}

export default ReactotronProvider;
