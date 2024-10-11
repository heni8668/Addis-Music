import { all } from 'redux-saga/effects'

import musicSagas from './musicSagas'

export default function* rootSaga() {
    yield all ([ musicSagas()])
}