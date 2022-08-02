import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TRACK_FILTER_FEATURE_KEY, State } from './track-filter.models';

export const getTrackFilterState = createFeatureSelector<State>(
  TRACK_FILTER_FEATURE_KEY
);

export const getMoodFilter = createSelector(
  getTrackFilterState,
  (state: State): string[] => {
    return state.moodFilters;
  }
);

export const getSetFilter = createSelector(
  getTrackFilterState,
  (state: State): string[] => {
    return state.setFilters;
  }
);

export const getGenreFilter = createSelector(
  getTrackFilterState,
  (state: State): string[] => {
    return state.genreFilters;
  }
);

export const getVideoFilter = createSelector(
  getTrackFilterState,
  (state: State): boolean => {
    return state.onlyWithVideos;
  }
);

export const getSearchTerm = createSelector(
  getTrackFilterState,
  (state: State): string => {
    return state.searchTerm;
  }
);

export const getOnlyFavoritesFilter = createSelector(
  getTrackFilterState,
  (state: State): boolean => {
    return state.onlyFavorites;
  }
);
