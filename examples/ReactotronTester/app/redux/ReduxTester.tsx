import React, { Component } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { connect } from "react-redux"

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
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={this.handleSendAction}>
          <View>
            <Text>Send an action</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleSendThunkAction}>
          <View>
            <Text>Send an thunk action</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const thunk = () => dispatch => {
  dispatch({ type: "RandomThunkAction" })
}

export default connect(
  undefined,
  dispatch => ({
    dispatchAction: () => {
      dispatch({ type: "RandomAction", payload: { isHere: true } })
    },
    dispatchThunk: () => {
      dispatch(thunk())
    },
  }),
)(ReduxTester)
