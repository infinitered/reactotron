import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import styled from "styled-components"

import SideBar from "./components/SideBar"
import Footer from "./components/Footer"
import { StandaloneProvider } from "./contexts/Standalone"

import Home from "./pages/home"
import Timeline from "./pages/timeline"
import Help from "./pages/help"

const AppContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background};
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
      <StandaloneProvider>
        <AppContainer>
          <TopSection>
            <SideBar />

            <MainContainer>
              {/* Home */}
              <Route path="/home" exact component={Home} />

              {/* Timeline */}
              <Route path="/" exact component={Timeline} />

              {/* State */}
              <Route
                path="/state/subscriptions"
                exact
                component={() => <div>Subscriptions!</div>}
              />
              <Route path="/state/backups" exact component={() => <div>Backups!</div>} />

              {/* React Native */}

              {/* Custom Commands */}

              {/* Help */}
              <Route path="/help" exact component={Help} />
            </MainContainer>
          </TopSection>
          <Footer />
        </AppContainer>
      </StandaloneProvider>
    </Router>
  )
}

export default App
