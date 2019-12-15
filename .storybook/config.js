import React from "react"
import { configure, addDecorator } from "@storybook/react"
import { withKnobs } from "@storybook/addon-knobs"

import ReactotronProvider from "../src/components/ReactotronProvider"

import theme from "../src/theme"

const StyledDecorator = storyFn => <ReactotronProvider>{storyFn()}</ReactotronProvider>
addDecorator(StyledDecorator)

addDecorator(withKnobs)

configure(require.context("../src", true, /\.story\.tsx$/), module)
