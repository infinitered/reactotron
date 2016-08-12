import React, { Component } from 'react'
import Header from './Header'
import Page from './Page'
import PageLogging from '../Logging/PageLogging'
import PageState from '../State/PageState'
import PageNetworking from '../Network/PageNetworking'
import Footer from './Footer'
import Colors from '../Theme/Colors'
import AppStyles from '../Theme/AppStyles'
import PageStreaming from '../Streaming/PageStreaming'

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
        {/*
        <Page tabId='logging'>
          <PageLogging />
        </Page>
        <Page tabId='state'>
          <PageState />
        </Page>
        <Page tabId='network'>
          <PageNetworking />
        </Page>
        */}
        <Page tabId='streaming'>
          <PageStreaming />
        </Page>
        <Footer />
      </div>
    )
  }
}
