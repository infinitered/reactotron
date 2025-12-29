import React, { useCallback, useContext, useMemo, useState } from "react"
import { clipboard, shell } from "electron"
import fs from "fs"
import os from "os"
import path from "path"
import debounce from "lodash.debounce"
import {
  Header,
  filterCommands,
  TimelineFilterModal,
  EmptyState,
  ReactotronContext,
  TimelineContext,
  RandomJoke,
  timelineCommandResolver,
} from "reactotron-core-ui"
import {
  MdSearch,
  MdDeleteSweep,
  MdFilterList,
  MdSwapVert,
  MdReorder,
  MdDownload,
  MdConnectWithoutContact,
} from "react-icons/md"
import { FaTimes } from "react-icons/fa"
import Styles from "./components/timeline.styles"
import { Command, BetterNetwork } from "./components/better-network"

const {
  Container,
  TimelineContainer,
  SearchContainer,
  SearchLabel,
  SearchInput,
  ButtonContainer,
  HelpMessage,
  QuickStartButtonContainer,
  Divider,
} = Styles

function Timeline() {
  const { sendCommand, clearCommands, commands, openDispatchModal } = useContext(ReactotronContext)
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(true)

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

  let filteredCommands
  try {
    filteredCommands = filterCommands(commands, search, hiddenCommands)
  } catch (error) {
    console.error(error)
    filteredCommands = commands
  }

  if (isReversed) {
    filteredCommands = filteredCommands.reverse()
  }

  const dispatchAction = useCallback((action: any) => {
    sendCommand("state.action.dispatch", { action })
  }, [sendCommand])

  function openDocs() {
    shell.openExternal("https://docs.infinite.red/reactotron/quick-start/react-native/")
  }

  function downloadLog() {
    const homeDir = os.homedir()
    const downloadDir = path.join(homeDir, "Downloads")
    fs.writeFileSync(
      path.resolve(downloadDir, `timeline-log-${Date.now()}.json`),
      JSON.stringify(commands || []),
      "utf8"
    )
    console.log(`Exported timeline log to ${downloadDir}`)
  }

  const { searchString, handleInputChange } = useDebouncedSearchInput(search, setSearch, 300)

  const renderCommandList = useMemo(() => {
    return filteredCommands.map((command) => {
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
  }, [dispatchAction, filteredCommands, openDispatchModal, sendCommand])

  const shouldRenderNoContent = filteredCommands.length === 0
  const shouldRenderCustomNetwork = isNetworkModalOpen && filteredCommands.length > 0
  const shouldRenderCommandList = !isNetworkModalOpen && filteredCommands.length > 0

  return (
    <Container>
      <Header
        title="Timeline"
        isDraggable
        actions={[
          {
            tip: "Network",
            icon: MdConnectWithoutContact,
            onClick: () => {
              setIsNetworkModalOpen((prev) => !prev)
            },
          },
          {
            tip: "Export Log",
            icon: MdDownload,
            onClick: () => {
              downloadLog()
            },
          },
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
        {shouldRenderNoContent && (
          <EmptyState icon={MdReorder} title="No Activity">
            <HelpMessage>
              Once your app connects and starts sending events, they will appear here.
            </HelpMessage>
            <QuickStartButtonContainer onClick={openDocs}>
              Check out the quick start guide here!
            </QuickStartButtonContainer>
            <Divider />
            <RandomJoke />
          </EmptyState>
        )}
        {shouldRenderCustomNetwork && <BetterNetwork commands={filteredCommands as Command[]} />}
        {shouldRenderCommandList && renderCommandList}
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
