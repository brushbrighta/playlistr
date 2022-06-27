import { createReducer, on, Action } from '@ngrx/store';

import * as AppleMusicActions from './apple-music.actions';
import { appleMusicTrackAdapter, State } from './apple-music.models';

export const initialState: State = appleMusicTrackAdapter.getInitialState({
  loaded: false,
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
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return appleMusicReducer(state, action);
}
