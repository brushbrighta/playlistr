import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  DISCOGS_RELEASE_FEATURE_KEY,
  discogsReleaseAdapter,
  State,
} from './discogs-release.models';

// Lookup the 'DiscogsRelease' feature state managed by NgRx
export const getDiscogsReleaseState = createFeatureSelector<State>(
  DISCOGS_RELEASE_FEATURE_KEY
);

const { selectAll, selectEntities } = discogsReleaseAdapter.getSelectors();

export const getDiscogsReleaseLoaded = createSelector(
  getDiscogsReleaseState,
  (state: State) => state.loaded
);

export const getDiscogsReleaseLoading = createSelector(
  getDiscogsReleaseState,
  (state: State) => !state.loaded
);

export const getDiscogsReleaseError = createSelector(
  getDiscogsReleaseState,
  (state: State) => state.error
);

export const getAllDiscogsRelease = createSelector(
  getDiscogsReleaseState,
  (state: State) => selectAll(state)
);

export const getDiscogsReleaseEntities = createSelector(
  getDiscogsReleaseState,
  (state: State) => selectEntities(state) || {}
);

export const getSelectedId = createSelector(
  getDiscogsReleaseState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getDiscogsReleaseEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
