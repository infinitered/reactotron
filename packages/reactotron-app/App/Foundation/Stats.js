import React, { Component } from "react"
import Colors from '../Theme/Colors'
import AppStyles from "../Theme/AppStyles"
import { inject, observer } from "mobx-react"
import StatsHeader from "./StatsHeader"

const Styles = {
  container: {
    ...AppStyles.Layout.vbox,
    margin: 0,
    flex: 1,
  },
  content: {
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    overflowY: "scroll",
    overflowX: "hidden",
  },
  label: {
    color: Colors.heading,
  },
  value: {
    color: Colors.tag,
  },
}

@inject("session")
@observer
class Stats extends Component {
  renderStat(label, value) {
    return (
      <div>
        <span style={Styles.label}>{label}: </span>
        <span style={Styles.value}>{value}</span>
      </div>
    )
  }

  render() {
    const { devTracker } = this.props.session

    return (
      <div style={Styles.container}>
        <StatsHeader />
        <div style={Styles.content}>
          {this.renderStat('Connected Time', devTracker.formattedTime)}
          {this.renderStat('Total Errors', devTracker.totalErrors)}
          {this.renderStat('Errors Per Second', devTracker.errorsPerSecond)}
          {this.renderStat('Errors Per Minute', devTracker.errorsPerMinute)}
          {this.renderStat('Errors Per Hour', devTracker.errorsPerHour)}
        </div>
      </div>
    )
  }
}

export default Stats
