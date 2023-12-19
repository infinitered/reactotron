import React, { useContext, useEffect } from "react"
import StandaloneContext from "../../contexts/Standalone"

import SidebarStateless from "./Sidebar"
import { useStore } from "../../models/RootStore"
import { observer } from "mobx-react-lite"
import { ipcRenderer } from "electron"

function SideBar() {
  const store = useStore()
  const { serverStatus } = useContext(StandaloneContext)

  useEffect(() => {
    ipcRenderer.on("sidebar:toggle", () => {
      store.toggleSidebar()
    })

    return () => {
      ipcRenderer.removeAllListeners("sidebar:toggle")
    }
  }, [store])

  return <SidebarStateless isOpen={store.sidebarOpen} serverStatus={serverStatus} />
}

export default observer(SideBar)
