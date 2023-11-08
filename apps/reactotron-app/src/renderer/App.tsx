import React from "react"
import { Route, HashRouter as Router, Routes } from "react-router-dom"
import styled from "rn-css"

import RootModals from "./RootModals"
import Footer from "./components/Footer"
import SideBar from "./components/SideBar"
import RootContextProvider from "./contexts"

import CustomCommands from "./pages/customCommands"
import Help from "./pages/help"
import Home from "./pages/home"
import Overlay from "./pages/reactNative/Overlay"
import Storybook from "./pages/reactNative/Storybook"
import Snapshots from "./pages/state/Snapshots"
import Subscriptions from "./pages/state/Subscriptions"
import Timeline from "./pages/timeline"

const AppContainer = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.background};
`

const TopSection = styled.View`
  overflow: hidden;
  display: flex;
  flex-grow: 1;
  flex-direction: row;
`

const MainContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex: 1;
`

function App() {
  return (
    <Router>
      <RootContextProvider>
        <AppContainer>
          <TopSection>
            <SideBar />

            <MainContainer>
              <Routes>
                {/* Home */}
                <Route path="/home" element={<Home />} />

                {/* Timeline */}
                <Route path="/" element={<Timeline />} />

                {/* State */}
                <Route path="/state/subscriptions" element={<Subscriptions />} />
                <Route path="/state/snapshots" element={<Snapshots />} />

                {/* React Native */}
                <Route path="/native/overlay" element={<Overlay />} />
                <Route path="/native/storybook" element={<Storybook />} />

                {/* Custom Commands */}
                <Route path="/customCommands" element={<CustomCommands />} />

                {/* Help */}
                <Route path="/help" element={<Help />} />
              </Routes>
            </MainContainer>
          </TopSection>
          <Footer />
        </AppContainer>
        <RootModals />
      </RootContextProvider>
    </Router>
  )
}

export default App
