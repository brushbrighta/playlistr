import { createReducer, on, Action } from '@ngrx/store';

import * as TrackFilterActions from './track-filter.actions';
import { State, inititalState } from './track-filter.models';

const trackFilterReducer = createReducer(
  inititalState,
  on(TrackFilterActions.setMoodFilter, (state, { filters }) => ({
    ...state,
    moodFilters: filters,
  })),
  on(TrackFilterActions.setSetFilter, (state, { filters }) => ({
    ...state,
    setFilters: filters,
  })),
  on(TrackFilterActions.setGenreFilter, (state, { filters }) => ({
    ...state,
    genreFilters: filters,
  })),
  on(TrackFilterActions.setVideoFilter, (state, { onlyWithVideos }) => ({
    ...state,
    onlyWithVideos,
  })),
  on(TrackFilterActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
  on(TrackFilterActions.setOnlyFavorites, (state, { onlyFavorites }) => ({
    ...state,
    onlyFavorites,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return trackFilterReducer(state, action);
}
