import React, { Component } from "react"
import AppStyles from "../Theme/AppStyles"
import Header from "./Header"
import Tab from "./Tab"

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
}

class Tabs extends Component {
  handleSelectTab = tab => {
    this.props.onSwitchTab(tab)
  }

  render() {
    const { selectedTab, children } = this.props

    const tabs = []
    let SelectedTabComponent = null
    let ActionComponent = null

    React.Children.forEach(children, tab => {
      tabs.push({
        icon: tab.props.icon,
        text: tab.props.text,
        name: tab.props.name,
      })

      if (tab.props.name === selectedTab) {
        SelectedTabComponent = tab
        ActionComponent = tab.props.renderActions ? tab.props.renderActions() : null
      }
    })

    return (
      <div style={Styles.container}>
        <Header selectedTab={selectedTab} tabs={tabs} onSelectTab={this.handleSelectTab}>
          {ActionComponent}
        </Header>
        {SelectedTabComponent}
      </div>
    )
  }
}

Tabs.Tab = Tab

export default Tabs
