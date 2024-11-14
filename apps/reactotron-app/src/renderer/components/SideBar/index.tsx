import React, { useContext } from "react"
import LayoutContext from "../../contexts/Layout"
import StandaloneContext from "../../contexts/Standalone"

import SidebarStateless from "./Sidebar"

function SideBar() {
  const { isSideBarOpen } = useContext(LayoutContext)

  const standaloneContext = useContext(StandaloneContext)
  const { serverStatus, selectedConnection } = standaloneContext

  return (
    <SidebarStateless
      isOpen={isSideBarOpen}
      serverStatus={serverStatus}
      plugins={selectedConnection?.plugins || []}
    />
  )
}

export default SideBar
