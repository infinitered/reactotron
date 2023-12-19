import React, { useEffect } from "react"

import SidebarStateless from "./Sidebar"
import { useStore } from "../../models/RootStore"
import { observer } from "mobx-react-lite"
import { ipcRenderer } from "electron"

function SideBar() {
  const store = useStore()

  useEffect(() => {
    ipcRenderer.on("sidebar:toggle", () => {
      store.toggleSidebar()
    })

    return () => {
      ipcRenderer.removeAllListeners("sidebar:toggle")
    }
  }, [store])

  return <SidebarStateless isOpen={store.sidebarOpen} serverStatus={store.serverStatus} />
}

export default observer(SideBar)
