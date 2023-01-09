import React, { Component } from "react"
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native"

import MobX from "./mobx/Tester"
import Redux from "./redux/Tester"

interface State {
  dataManager: string
}

export default class App extends Component<{}, State> {
  state = {
    dataManager: "redux",
  }

  handleCycleDataManager = () => {
    this.setState(prevState => ({
      dataManager: prevState.dataManager === "redux" ? "mobx-state-tree" : "redux",
    }))
  }

  render() {
    const { dataManager } = this.state

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ backgroundColor: "#cccccc" }}>
          <TouchableOpacity onPress={this.handleCycleDataManager}>
            <View style={{ paddingVertical: 15, alignItems: "center" }}>
              <Text>{dataManager}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
            {dataManager === "redux" && <Redux />}
            {dataManager === "mobx-state-tree" && <MobX />}
          </View>
      </SafeAreaView>
    )
  }
}
