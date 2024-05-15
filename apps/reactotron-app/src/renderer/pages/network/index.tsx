import React, { useContext, useMemo } from "react"
import { clipboard } from "electron"
import fs from "fs"
import {
  Header,
  filterCommands,
  EmptyState,
  ReactotronContext,
  NetworkContext,
  timelineCommandResolver,
} from "reactotron-core-ui"
import { MdSearch, MdDeleteSweep, MdSwapVert, MdReorder } from "react-icons/md"
import { FaTimes } from "react-icons/fa"
import styled from "styled-components"
import { CommandType } from "reactotron-core-contract"
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const NetworkPageContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 4px;
  padding-right: 10px;
`
const SearchLabel = styled.p`
  padding: 0 10px;
  font-size: 14px;
  color: ${(props) => props.theme.foregroundDark};
`
const SearchInput = styled.input`
  border-radius: 4px;
  padding: 10px;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border: none;
  color: ${(props) => props.theme.foregroundDark};
  font-size: 14px;
`
export const ButtonContainer = styled.div`
  padding: 10px;
  cursor: pointer;
`

export const NetworkTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid ${(props) => props.theme.chromeLine};
  border-radius: 4px;
  margin-bottom: 10px;
  color: ${(props) => props.theme.foregroundDark};
`

export const NetworkTableHeader = styled.thead`
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  color: ${(props) => props.theme.foregroundDark};
  font-size: 14px;
  font-weight: bold;
  text-align: left;
`
export const NetworkTableHeaderCell = styled.th`
  padding: 0 10px;
`

export const NetworkTableHeaderRow = styled.tr`
  height: 30px;
  "& th": {
    padding: 0 10px;
  }
`
export const NetworkTableBody = styled.tbody`
  font-size: 14px;
  color: ${(props) => props.theme.foregroundDark};
  font-weight: normal;
  text-align: left;
`
export const NetworkTableRow = styled.tr`
  height: 30px;
`

export const NetworkTableCell = styled.td`
  padding: 0 10px;
`

export const NetworkContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  width: 100%;
`
export const NetworkInspector = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 400px;
  resize: horizontal;
  max-width: 600px;
`

function NetworkPage() {
  const { sendCommand,clearNetworkCommands, commands, openDispatchModal } = useContext(ReactotronContext)
  const {
    isSearchOpen,
    toggleSearch,
    closeSearch,
    setSearch,
    search,
    isReversed,
    toggleReverse,
  } = useContext(NetworkContext)

  let filteredCommands = useMemo(() => {
    const cmds = filterCommands(commands, search, []).filter((a) =>
      a.type === CommandType.ApiResponse
    )
    return cmds;
  }, [commands, search])

  if (isReversed) {
    filteredCommands = filteredCommands.reverse()
  }

  return (
    <Container>
      <Header
        title="Network Inspect"
        isDraggable
        actions={[
          {
            tip: "Search",
            icon: MdSearch,
            onClick: () => {
              toggleSearch()
            },
          },
          {
            tip: "Reverse Order",
            icon: MdSwapVert,
            onClick: () => {
              toggleReverse()
            },
          },
          {
            tip: "Clear",
            icon: MdDeleteSweep,
            onClick: () => {
              clearNetworkCommands()
            },
          },
        ]}
      >
        {isSearchOpen && (
          <SearchContainer>
            <SearchLabel>Search</SearchLabel>
            <SearchInput autoFocus value={search} onChange={(e) => setSearch(e.target.value)} />
            <ButtonContainer
              onClick={() => {
                if (search === "") {
                  closeSearch()
                } else {
                  setSearch("")
                }
              }}
            >
              <FaTimes size={24} />
            </ButtonContainer>
          </SearchContainer>
        )}
      </Header>
      <NetworkPageContainer>
        {filteredCommands.length === 0 ? (
          <EmptyState icon={MdReorder} title="No Activity">
            Once your app connects and starts sending events, they will appear here.
          </EmptyState>
        ) : (
          
            filteredCommands.map((command) => {
              const CommandComponent = timelineCommandResolver(command.type)
  
              if (CommandComponent) {
                return (
                  <CommandComponent
                    key={command.messageId}
                    command={command}
                    copyToClipboard={clipboard.writeText}
                    readFile={(path) => {
                      return new Promise((resolve, reject) => {
                        fs.readFile(path, "utf-8", (err, data) => {
                          if (err || !data) reject(new Error("Something failed"))
                          else resolve(data)
                        })
                      })
                    }}
                    sendCommand={sendCommand}
                    openDispatchDialog={openDispatchModal}
                  />
                )
              }
  
              return null
            })
          
        )}
      </NetworkPageContainer>
    </Container>
  )
}

export default NetworkPage
