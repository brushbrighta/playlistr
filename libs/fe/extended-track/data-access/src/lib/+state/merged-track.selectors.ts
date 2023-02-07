import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  MERGED_TRACK_FEATURE_KEY,
  MergedTrackAdapter,
  State,
} from './merged-track.models';
import { MergedTrack } from '@playlistr/shared/types';

export const getMergedTrackState = createFeatureSelector<State>(
  MERGED_TRACK_FEATURE_KEY
);

const { selectAll, selectEntities } = MergedTrackAdapter.getSelectors();

export const getMergedTracksLoaded = createSelector(
  getMergedTrackState,
  (state: State) => state.loaded
);

export const getMergedTracksLoading = createSelector(
  getMergedTrackState,
  (state: State) => !state.loaded
);

export const getAllMergedTracks = createSelector(
  getMergedTrackState,
  (state: State) => selectAll(state)
);

export const getAllMergedTracksEntities = createSelector(
  getMergedTrackState,
  (state: State) => selectEntities(state)
);

export const mergedTracksByAppleId = createSelector(
  getAllMergedTracks,
  (tracks: MergedTrack[]) =>
    tracks.reduce((prev, curr) => {
      if (!curr.appleMusicTrackId) {
        return prev;
      }
      return {
        ...prev,
        [curr.appleMusicTrackId]: curr,
      };
    }, {})
);

export const getSelectedId = createSelector(
  getMergedTrackState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getAllMergedTracksEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
