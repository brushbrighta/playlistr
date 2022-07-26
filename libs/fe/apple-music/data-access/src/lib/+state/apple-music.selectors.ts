import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  APPLE_MUSIC_FEATURE_KEY,
  appleMusicTrackAdapter,
  State,
} from './apple-music.models';
import { AppleMusicTrack } from '@playlistr/shared/types';

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

const availableTags = (
  tracks: AppleMusicTrack[],
  what: 'MOOD' | 'SET' | '',
  field: 'Comments' | 'Genre' = 'Comments'
) => {
  return tracks.reduce((prev: string[], curr: AppleMusicTrack) => {
    const moods =
      curr[field]
        ?.replace(/\//g, field === 'Genre' ? '|' : ' ')
        .split(field === 'Genre' ? '|' : ' ')
        .map((v) => v.trim())
        .filter((v) => v.startsWith(what))
        .filter((v) => v !== what) || [];
    return [...new Set([...prev, ...moods])].sort((a, b) => a.localeCompare(b));
  }, []);
};

export const getAllMoods = createSelector(
  getAllAppleTracks,
  (tracks: AppleMusicTrack[]): string[] => {
    return availableTags(tracks, 'MOOD');
  }
);

export const getAllGenres = createSelector(
  getAllAppleTracks,
  (tracks: AppleMusicTrack[]): string[] => {
    return availableTags(tracks, '', 'Genre');
  }
);

export const getAllSets = createSelector(
  getAllAppleTracks,
  (tracks: AppleMusicTrack[]): string[] => {
    return availableTags(tracks, 'SET');
  }
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
