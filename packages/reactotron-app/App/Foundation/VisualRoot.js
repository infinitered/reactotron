import React, { Component } from 'react'
import Header from './Header'
import Page from './Page'
import Footer from './Footer'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import PageStreaming from './PageStreaming'
import ReactTooltip from 'react-tooltip'
import SampleModal from '../Dialogs/SampleModal'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.screen,
    height: '100vh',
    overflow: 'hidden'
  }
}

export default class VisualRoot extends Component {

  render () {
    return (
      <div style={Styles.container}>
        <Header />
        <Page tabId='streaming'>
          <PageStreaming />
        </Page>
        <Footer />
        <SampleModal />
        <ReactTooltip />
      </div>
    )
  }
}
