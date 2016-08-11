import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.screen,
    paddingLeft: 200,
    paddingRight: 150,
    paddingTop: 0,
    paddingBottom: 0,
    overflowY: 'scroll',
    marginRight: 4
  }
}

@inject('session')
@observer
class PageNetworking extends Component {

  render () {
    return (
      <div style={Styles.container}>
        Networking
      </div>
    )
  }

}

export default PageNetworking
