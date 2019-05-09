import * as React from "react"
import { render } from "react-dom"
import App from "./Foundation/App"
import "./app.global.css"

const ShutUpTypeScript: any = App

render(<ShutUpTypeScript />, document.getElementById("root"))

document.addEventListener("dragover", event => event.preventDefault())
document.addEventListener("drop", event => event.preventDefault())
