import React, { useContext } from "react"
import { ReactotronContext, Header, CommandType, ContentView, EmptyState, StateContext } from "reactotron-core-ui"
import { MdDelete, MdAdd, MdDeleteSweep, MdNotificationsNone, MdImportExport } from "react-icons/md"
import styled from "styled-components"
import { getApplicationKeyMap } from "react-hotkeys"

// Move this out of this page. We are just hacking around this for now
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

const SubscriptionContainer = styled.div`
  display: flex;
  padding: 15px 20px;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.line};
`
const SubscriptionPath = styled.div`
  flex: 0.3;
  word-break: break-all;
  cursor: text;
  user-select: text;
  color: ${props => props.theme.tag};
`
const SubscriptionValue = styled.div`
  flex: 0.7;
  word-break: break-all;
  user-select: text;
`
const SubscriptionRemove = styled.div`
  cursor: pointer;
  padding-left: 10px;
  color: ${props => props.theme.foreground};
`

function getLatestChanges(commands: any[]) {
  const changeCommands = commands.filter(c => c.type === CommandType.StateValuesChange)
  const latestChangeCommands = changeCommands.length > 0 ? changeCommands[0] : { payload: {} }
  return latestChangeCommands.payload.changes || []
}

function Subscriptions() {
  const { commands, openSubscriptionModal } = useContext(ReactotronContext)
  const { removeSubscription, clearSubscriptions } = useContext(StateContext)

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
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick: () => {},
          },
          {
            text: "Snapshots",
            icon: MdImportExport,
            isActive: false,
            onClick: () => {
              // TODO: Couldn't get react-router-dom to do it for me so I forced it.
              window.location.hash = "#/state/snapshots"
            },
          },
        ]}
        actions={[
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
      />
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
          subscriptionValues.map(subscription => {
            const value =
              typeof subscription.value === "object"
                ? { value: subscription.value }
                : subscription.value

            return (
              <SubscriptionContainer key={`subscription-${subscription.path}`}>
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
