import React, { Component } from 'react'
import { observer } from 'mobx-react'
import AppStyles from '../Theme/AppStyles'
import Colors from '../Theme/Colors'
import CommandList from '../Shared/CommandList'

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    backgroundColor: Colors.screen,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    overflowY: 'scroll'
  }
}

@observer
class PageStreaming extends Component {

  render () {
    return (
      <div style={Styles.container}>
        <CommandList />
      </div>
    )
  }

}

export default PageStreaming
