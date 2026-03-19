import React, { useContext, useState } from "react"

import StandaloneContext from "../../contexts/Standalone"

import Footer from "./Stateless"

export default function ConnectedFooter() {
  const { serverStatus, connections, selectedConnection, selectConnection, mcpStatus, mcpPort, toggleMcp } =
    useContext(StandaloneContext)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Footer
      serverStatus={serverStatus}
      connections={connections}
      selectedConnection={selectedConnection}
      onChangeConnection={selectConnection}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      mcpStatus={mcpStatus}
      mcpPort={mcpPort}
      onToggleMcp={toggleMcp}
    />
  )
}
