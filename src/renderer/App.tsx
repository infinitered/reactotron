import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import styled from "styled-components"

import SideBar from "./components/SideBar"
import { StandaloneProvider } from "./contexts/Standalone"

import Timeline from "./pages/timeline"

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.background};
`

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`

function App() {
  return (
    <Router>
      <StandaloneProvider>
        <AppContainer>
          <MainContainer>
            <SideBar />

            {/* Home */}
            <Route path="/home" exact component={() => <div>The Home Page!</div>} />

            {/* Timeline */}
            <Route path="/" exact component={Timeline} />

            {/* State */}
            <Route path="/state/subscriptions" exact component={() => <div>Subscriptions!</div>} />
            <Route path="/state/backups" exact component={() => <div>Backups!</div>} />
          </MainContainer>
        </AppContainer>
      </StandaloneProvider>
    </Router>
  )
}

export default App
