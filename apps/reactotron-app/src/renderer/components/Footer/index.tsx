import React, { useContext, useState } from "react"

import StandaloneContext from "../../contexts/Standalone"

import Footer from "./Stateless"
import { useStore } from "../../models/RootStore"
import { observer } from "mobx-react-lite"

export default observer(function ConnectedFooter() {
  const { connections, selectedConnection, selectConnection } = useContext(StandaloneContext)
  const [isOpen, setIsOpen] = useState(false)
  const store = useStore()

  return (
    <Footer
      serverStatus={store.serverStatus}
      connections={connections}
      selectedConnection={selectedConnection}
      onChangeConnection={selectConnection}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  )
})
