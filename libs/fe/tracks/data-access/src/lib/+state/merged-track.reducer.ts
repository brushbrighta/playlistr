import { createReducer, on, Action } from '@ngrx/store';

import * as MergedTrackActions from './merged-track.actions';
import { MergedTrackAdapter, State } from './merged-track.models';

export const initialState: State = MergedTrackAdapter.getInitialState({
  loaded: false,
});

const MergedTrackReducer = createReducer(
  initialState,
  on(MergedTrackActions.init, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(MergedTrackActions.loadMergedTracksSuccess, (state, { MergedTracks }) =>
    MergedTrackAdapter.setAll(MergedTracks, {
      ...state,
      loaded: true,
    })
  ),
  on(MergedTrackActions.loadMergedTracksFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return MergedTrackReducer(state, action);
}
