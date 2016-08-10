import React, { Component } from 'react'
import { observer, Provider } from 'mobx-react'
import Header from '../Components/Header'
import Body from '../Components/Body'
import Footer from '../Components/Footer'
import * as Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import SessionStore from '../Stores/SessionStore'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.screen,
    height: '100vh',
    overflow: 'hidden'
  }
}

const session = new SessionStore()

export default class App extends Component {

  render () {
    return (
      <Provider session={session}>
        <div style={Styles.container}>
          <Header />
          <Body />
          <Footer />
        </div>
      </Provider>
    )
  }
}
