import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  APPLE_MUSIC_FEATURE_KEY,
  appleMusicTrackAdapter,
  State,
} from './apple-music.models';

export const getAppleMusicState = createFeatureSelector<State>(
  APPLE_MUSIC_FEATURE_KEY
);

const { selectAll, selectEntities } = appleMusicTrackAdapter.getSelectors();

export const getAppleTracksLoaded = createSelector(
  getAppleMusicState,
  (state: State) => state.loaded
);

export const getAllAppleTracks = createSelector(
  getAppleMusicState,
  (state: State) => selectAll(state)
);

export const getAllAppleTracksEntities = createSelector(
  getAppleMusicState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getAppleMusicState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getAllAppleTracksEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
