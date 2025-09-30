import React, { useState, useContext } from "react"
import { Header, EmptyState, CustomCommandsContext } from "reactotron-core-ui"
import styled from "styled-components"
import { MdSearch } from "react-icons/md"
import { FaMagic } from "react-icons/fa"
import CustomCommandItem from "./components/CustomCommandItem"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const CommandsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 40px;
  padding-bottom: 0;
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

function CustomCommands() {
  const [isSearchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState("")

  const { customCommands, sendCustomCommand } = useContext(CustomCommandsContext)

  const lowerSearch = search.toLowerCase()
  const filteredCustomCommands =
    search !== ""
      ? customCommands.filter(
          (cc) =>
            cc.command.toLowerCase().indexOf(lowerSearch) > -1 ||
            (cc.title || "").toLowerCase().indexOf(lowerSearch) > -1 ||
            (cc.description || "").toLowerCase().indexOf(lowerSearch) > -1
        )
      : customCommands

  return (
    <Container>
      <Header
        title="Custom Commands"
        isDraggable
        actions={[
          {
            tip: "Search",
            icon: MdSearch,
            onClick: () => {
              setSearchOpen(!isSearchOpen)
            },
          },
        ]}
      >
        {isSearchOpen && (
          <SearchContainer>
            <SearchLabel>Search</SearchLabel>
            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
          </SearchContainer>
        )}
      </Header>
      <CommandsContainer>
        {customCommands.length === 0 ? (
          <EmptyState icon={FaMagic} title="No Custom Commands">
            When your app registers a custom command it will show here!
          </EmptyState>
        ) : (
          filteredCustomCommands.map((cc) => (
            <CustomCommandItem
              key={`${cc.clientId}-${cc.id}`}
              customCommand={cc}
              sendCustomCommand={sendCustomCommand}
            />
          ))
        )}
      </CommandsContainer>
    </Container>
  )
}

export default CustomCommands
