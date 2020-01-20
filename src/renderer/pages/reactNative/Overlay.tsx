import React from "react"
import styled from "styled-components"
import { Header, EmptyState } from "reactotron-core-ui"
import { MdBook, MdCamera } from "react-icons/md"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const OverlayContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

function Overlay() {
  return (
    <Container>
      <Header
        isDraggable
        tabs={[
          {
            text: "Image Overlay",
            icon: MdCamera,
            isActive: true,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick: () => {},
          },
          {
            text: "Storybook",
            icon: MdBook,
            isActive: false,
            onClick: () => {
              // TODO: Couldn't get react-router-dom to do it for me so I forced it.
              window.location.hash = "#/native/storybook"
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
      <OverlayContainer>
        <EmptyState icon={MdCamera} title="Coming back soon!">
          We will be getting this feature added back soon!
        </EmptyState>
      </OverlayContainer>
    </Container>
  )
}

export default Overlay
