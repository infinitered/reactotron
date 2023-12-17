import React, { useContext } from "react"
import StandaloneContext from "../../contexts/Standalone"

import SidebarStateless from "./Sidebar"
import { useStore } from "../../models/RootStore"
import { observer } from "mobx-react-lite"

function SideBar() {
  // const store = useStore()
  // const { serverStatus } = useContext(StandaloneContext)

  return <SidebarStateless isOpen={true} serverStatus={"started"} />
}

export default observer(SideBar)
