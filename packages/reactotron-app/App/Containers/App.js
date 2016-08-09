import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Header from '../Components/Header'
import Body from '../Components/Body'
import Footer from '../Components/Footer'
import * as Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.screen,
    height: '100vh',
    overflow: 'hidden'
  }
}

@observer
export default class App extends Component {
  render () {
    return (
      <div style={Styles.container}>
        <Header />
        <Body />
        <Footer />
      </div>
    )
  }
}
