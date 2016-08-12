import React, { Component } from 'react'
import { observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import SideMenu from '../Shared/SideMenu'
import StateActionList from './StateActionList'

const column = {
  flex: 1,
  paddingLeft: 10,
  paddingRight: 10,
  overflowY: 'scroll',

}

const Styles = {
  container: {
    ...AppStyles.Layout.hbox,
    backgroundColor: Colors.screen,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: 4
  },
  actions: {
    ...column
  },
  rightSide: {
    ...AppStyles.Layout.vbox
  },
  queries: {
    ...column
  },
  watches: {
    ...column
  },
  title: {
    fontSize: 20,
    textAlign: 'center'
  }
}

@observer
class PageLogging extends Component {

  render () {
    return (
      <div style={Styles.container}>
        <div style={Styles.actions}>
          <h1 style={Styles.title}>Completed Actions</h1>
          <StateActionList />
        </div>
        <div style={Styles.rightSide}>
          <div style={Styles.watches}>
            <h1 style={Styles.title}>Watches</h1>
          </div>
        </div>
      </div>
    )
  }

}

export default PageLogging
