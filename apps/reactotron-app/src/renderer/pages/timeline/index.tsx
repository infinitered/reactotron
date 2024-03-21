import React, { useCallback, useContext, useMemo } from "react"
import { clipboard } from "electron"
import fs from "fs"
import debounce from "lodash.debounce"
import {
  Header,
  filterCommands,
  TimelineFilterModal,
  timelineCommandResolver,
  EmptyState,
  ReactotronContext,
  TimelineContext,
} from "reactotron-core-ui"
import { MdSearch, MdDeleteSweep, MdFilterList, MdSwapVert, MdReorder } from "react-icons/md"
import { FaTimes } from "react-icons/fa"
import styled from "styled-components"
import { useAnalytics } from "../../util/analyticsHelpers"

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

function Timeline() {
  const { sendAnalyticsEvent } = useAnalytics()
  const { sendCommand, clearCommands, commands, openDispatchModal } = useContext(ReactotronContext)
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

  let filteredCommands = filterCommands(commands, search, hiddenCommands)

  if (isReversed) {
    filteredCommands = filteredCommands.reverse()
  }

  const dispatchAction = (action: any) => {
    sendCommand("state.action.dispatch", { action })
  }

  const { searchString, handleInputChange } = useDebouncedSearchInput(search, setSearch, 300)

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
              sendAnalyticsEvent({
                category: "timeline",
                action: "search",
                label: isSearchOpen ? "open" : "close",
              })
            },
          },
          {
            tip: "Filter",
            icon: MdFilterList,
            onClick: () => {
              openFilter()
              sendAnalyticsEvent({
                category: "timeline",
                action: "filter",
                label: isFilterOpen ? "open" : "close",
              })
            },
          },
          {
            tip: "Reverse Order",
            icon: MdSwapVert,
            onClick: () => {
              toggleReverse()
              sendAnalyticsEvent({
                category: "timeline",
                action: "reverse",
                label: isReversed ? "on" : "off",
              })
            },
          },
          {
            tip: "Clear",
            icon: MdDeleteSweep,
            onClick: () => {
              clearCommands()
              sendAnalyticsEvent({
                category: "timeline",
                action: "clear",
              })
            },
          },
        ]}
      >
        {isSearchOpen && (
          <SearchContainer>
            <SearchLabel>Search</SearchLabel>
            <SearchInput autoFocus value={searchString} onChange={handleInputChange} />
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
      <TimelineContainer>
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
          sendAnalyticsEvent({
            category: "timeline",
            action: "filter",
            label: "close",
          })
        }}
        hiddenCommands={hiddenCommands}
        setHiddenCommands={setHiddenCommands}
      />
    </Container>
  )
}

export default Timeline

const useDebouncedSearchInput = (
  initialValue: string,
  setSearch: (search: string) => void,
  delay: number = 300
) => {
  const [searchString, setSearchString] = React.useState<string>(initialValue)
  const debouncedOnChange = useMemo(() => debounce(setSearch, delay), [delay, setSearch])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      setSearchString(value)
      debouncedOnChange(value)
    },
    [debouncedOnChange]
  )

  return {
    searchString,
    handleInputChange,
  }
}
