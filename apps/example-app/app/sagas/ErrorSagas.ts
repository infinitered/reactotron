import { call, put } from "redux-saga/effects"
import * as Error from "../redux/ErrorRedux"

function dismantleBomb(cutTheRedWire) {
  if (cutTheRedWire) {
    this.isSparta("👢") // this is madness!
  }
}

export function* sagaError() {
  yield call(dismantleBomb, false)
  yield call(dismantleBomb, true)
}

export function* putError(action) {
  const { isSync } = action
  if (isSync) {
    yield put.sync({ type: Error.Types.PutThrow })
  } else {
    yield put({ type: Error.Types.PutThrow })
  }
}
