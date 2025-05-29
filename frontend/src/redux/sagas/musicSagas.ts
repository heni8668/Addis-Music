
import { call, put, takeLatest} from 'redux-saga/effects'
import { fetchMusics, addMusic, updateMusic, deleteMusic} from '../../api/musicApi'
import { fetchMusicsAsync, addMusicAsync, updateMusicAsync, deleteMusicAsync, fetchStatisticsAsync} from '../actions/musicActions'
import { AddMusicData, Music, Statistics } from '../Types/musicTypes'
import { PayloadAction } from "@reduxjs/toolkit";

// Fetch music saga
function* fetchMusicsSaga(
  action: ReturnType<typeof fetchMusicsAsync.pending>
): Generator {
  try {
    const musics: Music[] = (yield call(fetchMusics)) as Music[]; // Explicit type assertion
    yield put(fetchMusicsAsync.fulfilled(musics, action.meta.requestId)); // Adding requestId and meta for fullfilled
  } catch (error: any) {
    yield put(fetchMusicsAsync.rejected(error, action.meta.requestId)); // Adding requestId and meta for rejected
  }
}


// Add music saga

function* addMusicSaga(action: PayloadAction<AddMusicData>) {
  try {
     const newMusic: Music = yield call(addMusic, action.payload);
     yield put(
       addMusicAsync.fulfilled(newMusic, '', action.payload)
     );
  } catch (error: any) {
    yield put(addMusicAsync.rejected(error, "", action.payload));
  }
}

// Update music saga
function* updateMusicSaga(
  action: ReturnType<typeof updateMusicAsync.pending>
): Generator<any, void, any> {
  try {
    const { id, musicData } = action.meta.arg;
    const response = yield call(updateMusic, id, musicData);
    const updatedMusic: AddMusicData | any = response.data; 
    yield put(
      updateMusicAsync.fulfilled(
        updatedMusic,
        action.meta.requestId,
        action.meta.arg
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      yield put(
        updateMusicAsync.rejected(error, action.meta.requestId, action.meta.arg)
      );
    } else {
      yield put(
        updateMusicAsync.rejected(
          new Error("An unknown error occurred"),
          action.meta.requestId,
          action.meta.arg
        )
      );
    }
  }
}


// Delete music saga
function* deleteMusicSaga(action: ReturnType<typeof deleteMusicAsync.pending>) {
  try {
    const status: number = yield call(deleteMusic, action.meta.arg);
    yield put(
      deleteMusicAsync.fulfilled(status, action.meta.requestId, action.meta.arg)
    );
  } catch (error) {
    if (error instanceof Error) {
      yield put(
        deleteMusicAsync.rejected(error, action.meta.requestId, action.meta.arg)
      );
    } else {
      yield put(
        deleteMusicAsync.rejected(
          new Error("An unknown error occurred"),
          action.meta.requestId,
          action.meta.arg
        )
      );
    }
  }
}

// Fetch statistics saga
function* fetchStatisticsSaga(): Generator<any, void, Music[]> {
  try {
    // Fetch all music data
    const statistics: Music[] = yield call(fetchMusics);

    // Calculate stats
    const stats: Statistics = {
      totalMusic: statistics.length,
      totalGenres: new Set(statistics.map((music) => music.genre)).size,
      totalAlbums: new Set(statistics.map((music) => music.album)).size,
    };

    // Dispatch fulfilled action with stats
    yield put(fetchStatisticsAsync.fulfilled(stats, ''));
  } catch (error: any) {
    // Handle error by dispatching rejected action
    yield put(fetchStatisticsAsync.rejected(error.message, ''));
  }
}

//watcher sagas
function* musicSagas(): Generator {
    yield takeLatest(fetchMusicsAsync.pending.type, fetchMusicsSaga);
    yield takeLatest(addMusicAsync.pending.type, addMusicSaga);
    yield takeLatest(updateMusicAsync.pending.type, updateMusicSaga);
    yield takeLatest(deleteMusicAsync.pending.type, deleteMusicSaga);  
    
}

export default musicSagas;