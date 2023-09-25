import React from "react"
import { HashRouter as Router, Route, Switch } from "react-router-dom"
import styled from "styled-components"

import SideBar from "./components/SideBar"
import Footer from "./components/Footer"
import RootContextProvider from "./contexts"
import RootModals from "./RootModals"

import Home from "./pages/home"
import Timeline from "./pages/timeline"
import Subscriptions from "./pages/state/Subscriptions"
import Snapshots from "./pages/state/Snapshots"
import Overlay from "./pages/reactNative/Overlay"
import Storybook from "./pages/reactNative/Storybook"
import CustomCommands from "./pages/customCommands"
import Help from "./pages/help"

const AppContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.background};
`

const TopSection = styled.div`
  overflow: hidden;
  display: flex;
  flex-grow: 1;
  flex-direction: row;
`

const MainContainer = styled.div`
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
              <Switch>
                {/* Home */}
                <Route path="/home" exact>
                  <Home />
                </Route>

                {/* Timeline */}
                <Route path="/" exact>
                  <Timeline />
                </Route>

                {/* State */}
                <Route path="/state/subscriptions" exact>
                  <Subscriptions />
                </Route>
                <Route path="/state/snapshots" exact>
                  <Snapshots />
                </Route>

                {/* React Native */}
                <Route path="/native/overlay" exact>
                  <Overlay />
                </Route>
                <Route path="/native/storybook" exact>
                  <Storybook />
                </Route>

                {/* Custom Commands */}
                <Route path="/customCommands" exact>
                  <CustomCommands />
                </Route>

                {/* Help */}
                <Route path="/help" exact>
                  <Help />
                </Route>
              </Switch>
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
