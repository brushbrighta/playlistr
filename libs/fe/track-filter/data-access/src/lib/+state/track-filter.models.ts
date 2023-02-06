export const TRACK_FILTER_FEATURE_KEY = 'track-filter';

export interface State {
  setFilters: string[];
  moodFilters: string[];
  genreFilters: string[];
  onlyWithVideos: boolean;
  searchTerm: string;
  onlyFavorites: boolean;
}

export interface TrackFilterPartialState {
  readonly [TRACK_FILTER_FEATURE_KEY]: State;
}

export const inititalState: State = {
  setFilters: ['SET2'],
  moodFilters: [],
  genreFilters: [],
  onlyFavorites: true,
  searchTerm: '',
  onlyWithVideos: true,
};
