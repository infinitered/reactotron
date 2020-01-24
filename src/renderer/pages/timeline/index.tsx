import React, { useContext } from "react"
import { clipboard } from "electron"
import fs from "fs"
import {
  Header,
  filterCommands,
  TimelineFilterModal,
  timelineCommandResolver,
  EmptyState,
} from "reactotron-core-ui"
import { MdSearch, MdDeleteSweep, MdFilterList, MdSwapVert, MdReorder } from "react-icons/md"
import styled from "styled-components"

import ReactotronContext from "../../contexts/Reactotron"
import TimelineContext from "../../contexts/Timeline"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const TimelineContainer = styled.div`
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
  color: ${props => props.theme.foregroundDark};
`
const SearchInput = styled.input`
  border-radius: 4px;
  padding: 10px;
  flex: 1;
  background-color: ${props => props.theme.backgroundSubtleDark};
  border: none;
  color: ${props => props.theme.foregroundDark};
  font-size: 14px;
`

function Timeline() {
  const { sendCommand, clearCommands, commands, openDispatchModal } = useContext(ReactotronContext)
  const {
    isSearchOpen,
    toggleSearch,
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

  let filteredCommands = filterCommands(commands, search, hiddenCommands)

  if (isReversed) {
    filteredCommands = filteredCommands.reverse()
  }

  const dispatchAction = (action: any) => {
    sendCommand("state.action.dispatch", { action })
  }

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
            <SearchInput value={search} onChange={e => setSearch(e.target.value)} />
          </SearchContainer>
        )}
      </Header>
      <TimelineContainer>
        {filteredCommands.length === 0 ? (
          <EmptyState icon={MdReorder} title="No Activity">
            Once your app connects and starts sending events, they will appear here.
          </EmptyState>
        ) : (
          filteredCommands.map(command => {
            const CommandComponent = timelineCommandResolver(command.type)

            if (CommandComponent) {
              return (
                <CommandComponent
                  key={command.messageId}
                  command={command}
                  copyToClipboard={clipboard.writeText}
                  readFile={path => {
                    return new Promise((resolve, reject) => {
                      fs.readFile(path, "utf-8", (err, data) => {
                        if (err || !data) reject(new Error("Something failed"))
                        else resolve(data)
                      })
                    })
                  }}
                  sendCommand={command => sendCommand(command.type, command.payload)}
                  dispatchAction={dispatchAction}
                  openDispatchDialog={openDispatchModal}
                />
              )
            }

            return null
          })
        )}
      </TimelineContainer>
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

export default Timeline
