import React from "react"
import "react-native"
import { App } from "./App"

// Note: import explicitly to use the types shiped with jest.
import { it } from "@jest/globals"

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer"

it("renders correctly", () => {
  renderer.create(<App />)
})
