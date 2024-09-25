import React from "react"
import styled from "styled-components"
import { Header, ReactotronContext, TreeView } from "reactotron-core-ui"
import { MdWarning } from "react-icons/md"
import { HiDocumentSearch, HiOutlinePencilAlt } from "react-icons/hi"
import { TbDatabaseDollar } from "react-icons/tb"
import { Title } from "../reactNative/components/Shared"
import { OverlayButton } from "./components/Button"
import { CommandType } from "reactotron-core-contract"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const CacheContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

const TopSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const WarningContainer = styled.div`
  display: flex;
  color: ${(props) => props.theme.warning};
  background-color: ${(props) => props.theme.backgroundDarker};
  border-top: 1px solid ${(props) => props.theme.chromeLine};
  align-items: center;
  padding: 0 20px;
`
const WarningDescription = styled.div`
  margin-left: 20px;
`

let timer: ReturnType<typeof setTimeout>

function debounce(func: (...args: any) => any, timeout = 7000): void {
  clearTimeout(timer)
  timer = setTimeout(() => {
    // @ts-expect-error add typings for this
    func.apply(this, args)
  }, timeout)
}

const INITIAL_DATA = {
  id: "x",
  lastUpdateAt: new Date(),
  queries: [],
  mutations: [],
  cache: [],
}

function Cache() {
  const [data, setData] = React.useState<any>(INITIAL_DATA)
  const { sendCommand, addCommandListener } = React.useContext(ReactotronContext)

  const sendMessage = React.useCallback(() => {
    sendCommand("apollo.request", {})
  }, [sendCommand])

  const updateFragment = React.useCallback(() => {
    sendCommand("apollo.fragment.update", { message: "Title from server" })
  }, [sendCommand])

  const resyncData = React.useCallback(() => {
    debounce(() => {
      sendCommand("apollo.request", {})
    })
  }, [sendCommand])

  React.useEffect(() => {
    addCommandListener((command) => {
      if (command.type === CommandType.ApolloClientResponse) {
        console.log("new data = ", command.payload)

        // TODO reorder the way things come in so recent is at top
        // see https://github.com/expo/dev-plugins/blob/main/packages/apollo-client/webui/src/App.tsx#L44-L46
        setData(command.payload)
        sendCommand("apollo.ack", {})
        resyncData()
      }
    })
  }, [addCommandListener, sendCommand, resyncData])

  React.useEffect(() => {
    sendCommand("apollo.request", {})
  }, [])

  return (
    <Container>
      <Header
        isDraggable
        tabs={[
          {
            text: "Cache",
            icon: TbDatabaseDollar,
            isActive: true,

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick: () => {},
          },
          {
            text: "Queries",
            icon: HiDocumentSearch,
            isActive: false,
            onClick: () => {
              // TODO: Couldn't get react-router-dom to do it for me so I forced it.
              window.location.hash = "#/apolloClient/queries"
            },
          },
          {
            text: "Mutations",
            icon: HiOutlinePencilAlt,
            isActive: false,
            onClick: () => {
              // TODO: Couldn't get react-router-dom to do it for me so I forced it.
              window.location.hash = "#/apolloClient/mutations"
            },
          },
        ]}
        // actions={[
        //   {
        //     tip: "Search",
        //     icon: MdSearch,
        //     onClick: () => {
        //       toggleSearch()
        //     },
        //   },
        //   {
        //     tip: "Filter",
        //     icon: MdFilterList,
        //     onClick: () => {
        //       openFilter()
        //     },
        //   },
        //   {
        //     tip: "Reverse Order",
        //     icon: MdSwapVert,
        //     onClick: () => {
        //       toggleReverse()
        //     },
        //   },
        //   {
        //     tip: "Clear",
        //     icon: MdDeleteSweep,
        //     onClick: () => {
        //       clearSelectedConnectionCommands()
        //     },
        //   },
        // ]}
      />
      <CacheContainer>
        <TopSection>
          <Title>TODO (utilize state subscription for right now)</Title>
          <OverlayButton onClick={sendMessage} title={"Request Cache"} />
          <OverlayButton onClick={updateFragment} title={"Modify Cache"} />
        </TopSection>
        <TreeView value={data.cache} level={5} />
        <WarningContainer>
          <MdWarning size={60} />
          <WarningDescription>This is preview feature.</WarningDescription>
        </WarningContainer>
      </CacheContainer>
    </Container>
  )
}

export default Cache
