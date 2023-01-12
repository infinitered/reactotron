import {call, put} from 'redux-saga/effects';
import * as Error from '../Redux/ErrorRedux';
import {dismantleBomb} from '../Lib/BombSquad';

export function* sagaError() {
  yield call(dismantleBomb, false);
  yield call(dismantleBomb, true);
}

export function* putError(action) {
  const {isSync} = action;
  if (isSync) {
    yield put.sync({type: Error.Types.PutThrow});
  } else {
    yield put({type: Error.Types.PutThrow});
  }
}
