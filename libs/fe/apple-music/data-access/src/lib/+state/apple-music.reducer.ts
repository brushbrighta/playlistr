import { createReducer, on, Action } from '@ngrx/store';

import * as AppleMusicActions from './apple-music.actions';
import { appleMusicTrackAdapter, State } from './apple-music.models';

export const initialState: State = appleMusicTrackAdapter.getInitialState({
  loaded: false,
  setFilters: [],
  moodFilters: [],
  genreFilters: [],
});

const appleMusicReducer = createReducer(
  initialState,
  on(AppleMusicActions.init, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(
    AppleMusicActions.loadAppleMusicTracksSuccess,
    (state, { appleMusicTracks }) =>
      appleMusicTrackAdapter.setAll(appleMusicTracks, {
        ...state,
        loaded: true,
      })
  ),
  on(AppleMusicActions.loadAppleMusicTracksFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(AppleMusicActions.setMoodFilter, (state, { filters }) => ({
    ...state,
    moodFilters: filters,
  })),
  on(AppleMusicActions.setSetFilter, (state, { filters }) => ({
    ...state,
    setFilters: filters,
  })),
  on(AppleMusicActions.setGenreFilter, (state, { filters }) => ({
    ...state,
    genreFilters: filters,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return appleMusicReducer(state, action);
}
