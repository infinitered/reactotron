import React, { FunctionComponent } from "react"
import styled, { ThemeProvider } from "styled-components"

import theme from "../../theme"

const ReactotronContainer = styled.div`
  font-family: ${props => props.theme.fontFamily};
  font-size: 0.94em;
  width: 100%;
  height: 100%;
  user-select: none;
`

const ReactotronAppProvider: FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <ReactotronContainer>{children}</ReactotronContainer>
    </ThemeProvider>
  )
}

export default ReactotronAppProvider
