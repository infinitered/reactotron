import { call, put } from 'redux-saga/effects'
import * as Error from '../Redux/ErrorRedux'

function aDummyFunction() {

}

export function * sagaError () {
    yield call(aDummyFunction)
    object.that.doesnt.exist()
}

export function * putError () {
    yield put({ type: Error.Types.PutThrow })
}
