import React, { useContext } from "react"
import LayoutContext from "../../contexts/Layout"

import SidebarStateless from "./Stateless"

function SideBar() {
  const { isSideBarOpen } = useContext(LayoutContext)

  return <SidebarStateless isOpen={isSideBarOpen} />
}

export default SideBar
