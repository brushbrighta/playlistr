import { createAction, props } from '@ngrx/store';

export const setMoodFilter = createAction(
  '[TrackFilter] Set Mood Filter',
  props<{ filters: string[] }>()
);

export const setSetFilter = createAction(
  '[TrackFilter] Set Set Filter',
  props<{ filters: string[] }>()
);

export const setGenreFilter = createAction(
  '[TrackFilter] Set Genre Filter',
  props<{ filters: string[] }>()
);

export const setVideoFilter = createAction(
  '[TrackFilter] Set video Filter',
  props<{ onlyWithVideos: boolean }>()
);

export const setSearchTerm = createAction(
  '[TrackFilter] Set search term',
  props<{ searchTerm: string }>()
);
