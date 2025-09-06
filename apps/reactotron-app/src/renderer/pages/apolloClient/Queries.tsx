import React from "react"
import styled from "styled-components"
import { Header } from "reactotron-core-ui"
import { MdWarning } from "react-icons/md"
import { HiDocumentSearch, HiOutlinePencilAlt } from "react-icons/hi"
import { TbDatabaseDollar } from "react-icons/tb"
import { Title } from "../reactNative/components/Shared"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const StorybookContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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

function Queries() {
  return (
    <Container>
      <Header
        isDraggable
        tabs={[
          {
            text: "Cache",
            icon: TbDatabaseDollar,
            isActive: false,
            onClick: () => {
              // TODO: Couldn't get react-router-dom to do it for me so I forced it.
              window.location.hash = "#/apolloClient/cache"
            },
          },
          {
            text: "Queries",
            icon: HiDocumentSearch,
            isActive: true,

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
      <StorybookContainer>
        <TopSection>
          <Title>TODO</Title>
        </TopSection>
        <WarningContainer>
          <MdWarning size={60} />
          <WarningDescription>This is preview feature.</WarningDescription>
        </WarningContainer>
      </StorybookContainer>
    </Container>
  )
}

export default Queries
