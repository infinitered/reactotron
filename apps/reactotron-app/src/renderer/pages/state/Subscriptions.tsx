import React, { useContext, useState } from "react"
import {
  ReactotronContext,
  ContentView,
  StateContext,
  Header,
  EmptyState,
} from "reactotron-core-ui"
import { CommandType } from "reactotron-core-contract"
import { MdDelete, MdAdd, MdDeleteSweep, MdNotificationsNone, MdImportExport, MdSearch } from "react-icons/md"
import { FaTimes } from "react-icons/fa"
import styled from "styled-components"
import { getApplicationKeyMap } from "react-hotkeys"
import { KeybindKeys, getPlatformSequence } from "../help/components/Keybind"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const SubscriptionsContainer = styled.div`
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

const ButtonContainer = styled.div`
  padding: 10px;
  cursor: pointer;
`

const SubscriptionContainer = styled.div`
  display: flex;
  padding: 15px 20px;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.line};
`
const SubscriptionPath = styled.div`
  flex: 0.3;
  word-break: break-all;
  cursor: text;
  user-select: text;
  color: ${(props) => props.theme.tag};
`
const SubscriptionValue = styled.div`
  flex: 0.7;
  word-break: break-all;
  user-select: text;
`
const SubscriptionRemove = styled.div`
  cursor: pointer;
  padding-left: 10px;
  color: ${(props) => props.theme.foreground};
`

function getLatestChanges(commands: Array<{ type: string; payload?: { changes?: Array<{ path: string; value: unknown }> } }>): Array<{ path: string; value: unknown }> {
  const changeCommands = commands.filter((c) => c.type === CommandType.StateValuesChange)
  const latestChangeCommands = changeCommands.length > 0 ? changeCommands[0] : { payload: {} }
  const payload = latestChangeCommands.payload as { changes?: Array<{ path: string; value: unknown }> } | undefined
  return payload && Array.isArray(payload.changes)
    ? payload.changes
    : []
}

function Subscriptions() {
  const { commands, openSubscriptionModal } = useContext(ReactotronContext)
  const { removeSubscription, clearSubscriptions } = useContext(StateContext)

  // 검색 UI 상태만 유지
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [search, setSearch] = useState("")

  // Get setup to show the right keybind!
  const subscriptionModalKeybind = getApplicationKeyMap().OpenSubscriptionModal
  const subscriptionModalSequence = subscriptionModalKeybind
    ? getPlatformSequence(subscriptionModalKeybind)
    : null

  const subscriptionValues = getLatestChanges(commands)

  return (
    <Container>
      <Header
        isDraggable
        tabs={[
          {
            text: "Subscriptions",
            icon: MdNotificationsNone,
            isActive: true,
            onClick: () => {},
          },
          {
            text: "Snapshots",
            icon: MdImportExport,
            isActive: false,
            onClick: () => {
              window.location.hash = "#/state/snapshots"
            },
          },
        ]}
        actions={[
          {
            tip: "Search",
            icon: MdSearch,
            onClick: () => {
              setIsSearchOpen(!isSearchOpen)
            },
          },
          {
            tip: "Add",
            icon: MdAdd,
            onClick: () => {
              openSubscriptionModal()
            },
          },
          {
            tip: "Clear",
            icon: MdDeleteSweep,
            onClick: () => {
              clearSubscriptions()
            },
          },
        ]}
      >
        {isSearchOpen && (
          <SearchContainer>
            <SearchLabel>Search</SearchLabel>
            <SearchInput
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search in paths and values..."
            />
            <ButtonContainer
              onClick={() => {
                if (search === "") {
                  setIsSearchOpen(false)
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
      <SubscriptionsContainer>
        {subscriptionValues.length === 0 ? (
          <EmptyState icon={MdNotificationsNone} title="No Subscriptions">
            You can subscribe to state changes in your redux or mobx-state-tree store by pressing{" "}
            {subscriptionModalSequence && (
              <KeybindKeys
                keybind={subscriptionModalKeybind}
                sequence={subscriptionModalSequence}
                addWidth={false}
              />
            )}
          </EmptyState>
        ) : (
          subscriptionValues.map((subscription, index) => {
            const value =
              typeof subscription.value === "object"
                ? { value: subscription.value }
                : subscription.value

            return (
              <SubscriptionContainer key={`subscription-${subscription.path}-${index}`}>
                <SubscriptionPath>{subscription.path}</SubscriptionPath>
                <SubscriptionValue>
                  <ContentView value={value} />
                </SubscriptionValue>
                <SubscriptionRemove>
                  <MdDelete
                    size={24}
                    onClick={() => {
                      removeSubscription(subscription.path)
                    }}
                  />
                </SubscriptionRemove>
              </SubscriptionContainer>
            )
          })
        )}
      </SubscriptionsContainer>
    </Container>
  )
}

export default Subscriptions
