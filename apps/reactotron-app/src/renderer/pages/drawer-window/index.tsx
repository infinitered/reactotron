import React, { useEffect, useState } from "react"
import { ipcRenderer } from "electron"
import styled from "styled-components"
import { Command } from "../timeline/components/better-network"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.foreground};
  overflow-y: auto;
`

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${(props) => props.theme.border};
  font-size: 18px;
  font-weight: bold;
  -webkit-app-region: drag;
`

const Content = styled.div`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
`

const CommandItem = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 4px;
  background-color: ${(props) => props.theme.chrome};
`

const CommandType = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: ${(props) => props.theme.tag};
`

const CommandDetails = styled.div`
  font-size: 12px;
  color: ${(props) => props.theme.foregroundDark};
`

function DrawerWindow() {
  const [commands, setCommands] = useState<Command[]>([])

  useEffect(() => {
    const handleUpdateCommands = (_event: any, newCommands: Command[]) => {
      setCommands(newCommands)
    }

    ipcRenderer.on("update-drawer-commands", handleUpdateCommands)

    return () => {
      ipcRenderer.removeListener("update-drawer-commands", handleUpdateCommands)
    }
  }, [])

  return (
    <Container>
      <Header>Timeline Commands</Header>
      <Content>
        {commands.length === 0 ? (
          <div>No commands to display</div>
        ) : (
          commands.map((command) => (
            <CommandItem key={command.messageId}>
              <CommandType>{command.type}</CommandType>
              <CommandDetails>
                <div>Message ID: {command.messageId}</div>
                <div>Connection ID: {command.connectionId}</div>
                <div>Date: {new Date(command.date).toLocaleString()}</div>
                {command.clientId && <div>Client ID: {command.clientId}</div>}
              </CommandDetails>
            </CommandItem>
          ))
        )}
      </Content>
    </Container>
  )
}

export default DrawerWindow
