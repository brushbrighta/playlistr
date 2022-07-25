import { createReducer, on, Action } from '@ngrx/store';

import * as DiscogsReleaseActions from './discogs-release.actions';
import { discogsReleaseAdapter, State } from './discogs-release.models';

export const initialState: State = discogsReleaseAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const discogsReleaseReducer = createReducer(
  initialState,
  on(DiscogsReleaseActions.init, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(
    DiscogsReleaseActions.loadDiscogsReleaseSuccess,
    (state, { discogsRelease }) =>
      discogsReleaseAdapter.setAll(discogsRelease, { ...state, loaded: true })
  ),
  on(DiscogsReleaseActions.loadDiscogsReleaseFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return discogsReleaseReducer(state, action);
}
