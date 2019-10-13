import React from "react"
import { configure, addDecorator } from "@storybook/react"
import { withKnobs } from "@storybook/addon-knobs"
import { ThemeProvider } from "styled-components"

import theme from "../src/theme"

const StyledDecorator = storyFn => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
addDecorator(StyledDecorator)

addDecorator(withKnobs)

configure(require.context("../src", true, /\.story\.tsx$/), module)
