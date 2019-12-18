import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { boolean } from "@storybook/addon-knobs"
import { MdReorder } from "react-icons/md"

import SideBarButton from "./Stateless"

const reactotronLogo = require("../../images/Reactotron-128.png")

export default {
  title: "SideBar Button",
}

export const IconInactive = () => (
  <Router>
    <div style={{ width: 80 }}>
      <SideBarButton icon={MdReorder} path="/" text="Hello?" isActive={false} />
    </div>
  </Router>
)

export const IconActive = () => (
  <Router>
    <div style={{ width: 80 }}>
      <SideBarButton icon={MdReorder} path="/" text="Hello?" isActive={true} />
    </div>
  </Router>
)

export const IconInteractive = () => {
  const isActive = boolean("isActive", false)

  return (
    <Router>
      <div style={{ width: 80 }}>
        <SideBarButton icon={MdReorder} path="/" text="Hello?" isActive={isActive} />
      </div>
    </Router>
  )
}

export const ImageInactive = () => (
  <Router>
    <div style={{ width: 80 }}>
      <SideBarButton image={reactotronLogo} path="/" text="Hello?" isActive={false} />
    </div>
  </Router>
)

export const ImageActive = () => (
  <Router>
    <div style={{ width: 80 }}>
      <SideBarButton image={reactotronLogo} path="/" text="Hello?" isActive={true} />
    </div>
  </Router>
)

export const ImageInteractive = () => {
  const isActive = boolean("isActive", false)

  return (
    <Router>
      <div style={{ width: 80 }}>
        <SideBarButton image={reactotronLogo} path="/" text="Hello?" isActive={isActive} />
      </div>
    </Router>
  )
}

export const HideTopBar = () => (
  <Router>
    <div style={{ width: 80 }}>
      <SideBarButton icon={MdReorder} path="/" text="Hello?" isActive={true} hideTopBar />
    </div>
  </Router>
)

export const CustomIconSize = () => (
  <Router>
    <div style={{ width: 80 }}>
      <SideBarButton icon={MdReorder} path="/" text="Hello?" isActive={true} iconSize={10} />
    </div>
  </Router>
)
