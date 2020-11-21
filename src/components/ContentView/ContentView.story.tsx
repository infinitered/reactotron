import React from "react"

import ContentView from "./index"

export default {
  title: "Content View",
}

export const Null = () => <ContentView value={null} />
export const Undefined = () => <ContentView value={undefined} />
export const String = () => <ContentView value="Test item that should show correctly." />
export const StringMultiLine = () => (
  <ContentView value="Test item that should \n show correctly." />
)
export const Boolean = () => <ContentView value={false} />
export const Number = () => <ContentView value={2} />
export const Array = () => <ContentView value={[2]} />
export const ArrayMultiLevel = () => <ContentView value={[2, { test: true }]} />
export const Obj = () => <ContentView value={{ test: "This is only a test" }} />
export const ObjectMultiLevel = () => (
  <ContentView value={{ test: true, test2: { test3: "A string" } }} />
)
