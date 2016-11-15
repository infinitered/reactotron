import { put } from 'redux-saga/effects'

// process STARTUP actions
export function * startup () {
  yield put({ type: 'HELLO' })
}
