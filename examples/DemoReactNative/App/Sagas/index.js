import {all, takeEvery, takeLatest} from 'redux-saga/effects';
import * as Startup from '../Redux/StartupRedux';
import * as Repo from '../Redux/RepoRedux';
import * as Error from '../Redux/ErrorRedux';
import {startup} from './StartupSagas';
import {request as requestRepo} from './RepoSagas';
import {sagaError, putError} from './ErrorSagas';
import ApiSauce from 'apisauce';

// import Reactotron from 'reactotron-react-native'

const api = ApiSauce.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});

// api.addMonitor(console.tron.apisauce)

export default function* rootSaga() {
  yield all([
    takeEvery(Startup.Types.Startup, startup),
    takeLatest(Repo.Types.Request, requestRepo, api),
    takeEvery(Error.Types.Saga, sagaError),
    takeEvery(Error.Types.Put, putError),
  ]);
}
