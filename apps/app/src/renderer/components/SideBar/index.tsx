import React, { useContext } from "react"

import StandaloneContext from "../../contexts/Standalone"

import SidebarStateless from "./Stateless"

function SideBar() {
  const { isSideBarOpen } = useContext(StandaloneContext)

  return <SidebarStateless isOpen={isSideBarOpen} />
}

export default SideBar
