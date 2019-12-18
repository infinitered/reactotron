import React from "react"
import { BrowserRouter as Router } from "react-router-dom"

import SideBar from "./index"

export default {
  title: "SideBar",
}

export const Default = () => (
  <Router>
    <SideBar />
  </Router>
)
