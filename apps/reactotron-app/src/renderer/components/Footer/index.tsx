import React from "react"
import Footer from "./Stateless"
import { useStore } from "../../models/RootStore"
import { observer } from "mobx-react-lite"

export default observer(function ConnectedFooter() {
  const store = useStore()

  return (
    <Footer
      serverStatus={store.serverStatus}
      connections={store.connections}
      selectedConnection={store.selectedConnection}
      onChangeConnection={store.selectConnection}
      isOpen={store.footerExpanded}
      setIsOpen={(isOpen) => store.setProp("footer", isOpen ? "expanded" : "mini")}
    />
  )
})
