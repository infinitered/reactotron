import React, { Component } from "react"
import { View, Text, TouchableOpacity, ViewStyle } from "react-native"
import { connect } from "react-redux"
import { Action, Dispatch } from "redux"
import { AppDispatch, RootState } from "./store"

interface Props {
  dispatchAction: () => void
  dispatchThunk: () => void
}

class ReduxTester extends Component<Props> {
  handleSendAction = () => {
    this.props.dispatchAction()
  }

  handleSendThunkAction = () => {
    this.props.dispatchThunk()
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Open Reactotron</Text>
        <Text>Go to state tab</Text>
        <Text>Make sure you are on the subscriptions tab</Text>
        <Text>Press Ctrl+N or press +</Text>
        <Text>Type in "dummy.*"</Text>
        <Text>Press the buttons</Text>
        <Text>You should see your changes in real time</Text>
        <TouchableOpacity style={$buttonStyle} onPress={this.handleSendAction}>
          <View>
            <Text>Send an action</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={$buttonStyle}
          onPress={this.handleSendThunkAction}>
          <View>
            <Text>Send an thunk action</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const $buttonStyle: ViewStyle = {
  borderWidth: 1,
  borderColor: "grey",
  padding: 10,
  margin: 10,
}

const thunk = () => (dispatch: Dispatch) => {
  dispatch({ type: "RandomThunkAction" })
}

export default connect<RootState, Props, AppDispatch>(
  undefined,
  (dispatch) => ({
    dispatchAction: () => {
      dispatch({ type: "RandomAction", payload: { isHere: true } })
    },
    dispatchThunk: () => {
      dispatch(thunk() as unknown as Action)
    },
  }),
)(ReduxTester)
