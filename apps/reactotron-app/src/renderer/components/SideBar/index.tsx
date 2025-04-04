import React, { useContext } from "react"
import LayoutContext from "../../contexts/Layout"
import StandaloneContext from "../../contexts/Standalone"

import SidebarStateless from "./Sidebar"

function SideBar() {
  const { isSideBarOpen } = useContext(LayoutContext)
  const { serverStatus } = useContext(StandaloneContext)

  return <SidebarStateless isOpen={isSideBarOpen} serverStatus={serverStatus} />
}

export default SideBar
