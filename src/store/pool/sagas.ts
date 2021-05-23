import { all, delay,fork, put, takeEvery } from 'redux-saga/effects'
import { PoolActionTypes } from './types'
import { fetchError, fetchSuccess } from './actions'



function* handleFetch() {

  const data= {
    lockedNum: Math.floor(Math.random() * 100000000000),
    userEarnedNum: Math.floor(Math.random() * 100000000000),
  }

  yield delay(2000)
  yield put(fetchSuccess(data))


}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchFetchRequest() {
  yield takeEvery(PoolActionTypes.FETCH_REQUEST, handleFetch)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* poolSaga() {
  yield all([fork(watchFetchRequest)])
}

export default poolSaga
