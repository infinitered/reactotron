import React from "react"
import { configure, addDecorator } from "@storybook/react"
import { withKnobs } from "@storybook/addon-knobs"

import ReactotronAppProvider from "../src/components/ReactotronAppProvider"

const StyledDecorator = (storyFn) => <ReactotronAppProvider>{storyFn()}</ReactotronAppProvider>
addDecorator(StyledDecorator)

addDecorator(withKnobs)

configure(require.context("../src", true, /\.story\.tsx$/), module)
