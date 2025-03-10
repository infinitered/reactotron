import React from "react"
import styled, { ThemeProvider } from "styled-components"

import darkTheme, { lightTheme } from "../../theme"

const ReactotronContainer = styled.div`
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 0.94em;
  width: 100%;
  height: 100%;
  user-select: none;
`

const isDark = window.matchMedia("(prefers-color-scheme: dark)")

const getTheme = (isDark: boolean) => {
  return isDark ? darkTheme : lightTheme
}

const ReactotronAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = React.useState(getTheme(isDark.matches))

  isDark.addEventListener("change", ({ matches }) => setTheme(getTheme(matches)))

  return (
    <ThemeProvider theme={theme}>
      <ReactotronContainer>{children}</ReactotronContainer>
    </ThemeProvider>
  )
}

export default ReactotronAppProvider
