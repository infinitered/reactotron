import React, { useContext, useMemo } from "react"
import { clipboard } from "electron"
import fs from "fs"
import {
  Header,
  filterCommands,
  TimelineFilterModal,
  ApiResponseDrawerCommand,
  EmptyState,
  ReactotronContext,
  TimelineContext,
} from "reactotron-core-ui"
import { MdSearch, MdDeleteSweep, MdFilterList, MdSwapVert, MdReorder } from "react-icons/md"
import { FaTimes } from "react-icons/fa"
import styled from "styled-components"
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

type NetworkCommandType = {
  type: string
  important: boolean
  payload: {
    request: {
      url: string
      method: string
      data: string
      headers: Record<string, string>
      params: any
    }
    response: {
      body: unknown
      status: number
      headers: Record<string, string>
    }
    duration: number
  }
  connectionId: number
  messageId: number
  date: Date
  deltaTime: number
  clientId: string
}

function NetworkPage() {
  const [resizeEnabled, setResizeEnabled] = React.useState<boolean>(false)
  const { sendCommand, clearCommands, commands, openDispatchModal } = useContext(ReactotronContext)
  const [selectedRequest, setSelectedRequest] = React.useState<NetworkCommandType | null>(null)
  const [width, setWidth] = React.useState<number>(localStorage.getItem("networkInspectorWidth") ? parseInt(localStorage.getItem("networkInspectorWidth") as string) : 400)
  const {
    isSearchOpen,
    toggleSearch,
    closeSearch,
    setSearch,
    search,
    isReversed,
    toggleReverse,
    openFilter,
    closeFilter,
    isFilterOpen,
    hiddenCommands,
    setHiddenCommands,
  } = useContext(TimelineContext)

  let filteredCommands = useMemo(() => {
    const cmds = filterCommands(commands, search, hiddenCommands).filter((a) =>
      a.type.startsWith("api.")
    )
    return cmds as NetworkCommandType[]
  }, [commands, search, hiddenCommands])

  if (isReversed) {
    filteredCommands = filteredCommands.reverse()
  }
  console.log("filteredCommands", filteredCommands)

  return (
    <Container>
      <Header
        title="Timeline"
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
            tip: "Filter",
            icon: MdFilterList,
            onClick: () => {
              openFilter()
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
              clearCommands()
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
          <NetworkContainer>
            <div >
              <NetworkTable>
                <NetworkTableHeader>
                  <NetworkTableHeaderRow>
                    <NetworkTableHeaderCell>Time</NetworkTableHeaderCell>
                    <NetworkTableHeaderCell>Method</NetworkTableHeaderCell>
                    <NetworkTableHeaderCell>URL</NetworkTableHeaderCell>
                    <NetworkTableHeaderCell>Duration</NetworkTableHeaderCell>
                    <NetworkTableHeaderCell>Status</NetworkTableHeaderCell>
                    <NetworkTableHeaderCell>Size</NetworkTableHeaderCell>
                  </NetworkTableHeaderRow>
                </NetworkTableHeader>
                <NetworkTableBody>
                  {filteredCommands.map((command, index) => {
                    const { payload } = command
                    const { request, response, duration } = payload
                    const { url, method, headers } = request
                    const { status, headers: responseHeaders } = response
                    const size =
                      response?.["Content-Length"] || JSON.stringify(response.body).length
                    return (
                      <NetworkTableRow
                        key={index}
                        onClick={() => {
                          setSelectedRequest((f) => {
                            if (f === null) {
                              return command
                            }
                            if (f.clientId === command.clientId) {
                              return null
                            }
                            return command
                          })
                        }}
                      >
                        <NetworkTableCell>{command.date.toISOString()}</NetworkTableCell>
                        <NetworkTableCell>{method}</NetworkTableCell>
                        <NetworkTableCell>{url}</NetworkTableCell>
                        <NetworkTableCell>{duration}ms</NetworkTableCell>
                        <NetworkTableCell>{status}</NetworkTableCell>
                        <NetworkTableCell>{size}</NetworkTableCell>
                      </NetworkTableRow>
                    )
                  })}
                </NetworkTableBody>
              </NetworkTable>
            </div>
            {!!selectedRequest && (
              <NetworkInspector style={{width,position:"relative"}}>
                <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "5px",
                  backgroundColor: "transparent",
                  cursor: "col-resize",
                  zIndex: 1000,
                }}
                  onClick={(e) => {
                    setResizeEnabled(true)
                  }
                  }
                  onMouseUp={() => {
                    setResizeEnabled(false)
                  }}
                onMouseMove={(ev)=>{
                  // if click and drag on the divider, resize the inspector
                  if(resizeEnabled){
                    setWidth((f) => {
                      const newWidth = f - ev.movementX
                      localStorage.setItem("networkInspectorWidth", newWidth.toString())
                      return newWidth
                    })
                  }
                }} />
                <ResponseDetailComponent command={selectedRequest} />
              </NetworkInspector>
            )}
          </NetworkContainer>
        )}
      </NetworkPageContainer>
      <TimelineFilterModal
        isOpen={isFilterOpen}
        onClose={() => {
          closeFilter()
        }}
        hiddenCommands={hiddenCommands}
        setHiddenCommands={setHiddenCommands}
      />
    </Container>
  )
}

const ResponseDetailComponent = ({ command }: { command: NetworkCommandType }) => {
  return (
    <ApiResponseDrawerCommand
      key={command.messageId}
      //@ts-ignore
      command={command}
      isOpen={true}
      copyToClipboard={clipboard.writeText}
      readFile={(path) => {
        return new Promise((resolve, reject) => {
          fs.readFile(path, "utf-8", (err, data) => {
            if (err || !data) reject(new Error("Something failed"))
            else resolve(data)
          })
        })
      }}
    />
  )
}

export default NetworkPage
