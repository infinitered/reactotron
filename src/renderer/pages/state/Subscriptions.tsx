import React, { useContext } from "react"
import { Header, CommandType, ContentView, EmptyState } from "reactotron-core-ui"
import { MdDelete, MdAdd, MdDeleteSweep, MdNotificationsNone } from "react-icons/md"
import styled from "styled-components"

import ReactotronContext from "../../contexts/Reactotron"
import StateContext from "../../contexts/State"

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

  const subscriptionValues = getLatestChanges(commands)

  return (
    <Container>
      <Header
        title="Subscriptions"
        isDraggable
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
            {/* <Key text={Keystroke.modifierName} /> + <Key text="N" />. */}
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
