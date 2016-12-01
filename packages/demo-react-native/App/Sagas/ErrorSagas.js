import { call, put } from 'redux-saga/effects'
import * as Error from '../Redux/ErrorRedux'

function aDummyFunction () {
}

export function * sagaError () {
  yield call(aDummyFunction)
  object.that.doesnt.exist() // eslint-disable-line
}

export function * putError () {
  yield put.sync({ type: Error.Types.PutThrow })
}
