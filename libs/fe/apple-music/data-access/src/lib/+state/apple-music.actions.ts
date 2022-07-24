import { createAction, props } from '@ngrx/store';
import { AppleMusicTrack } from '@playlistr/shared/types';

export const init = createAction('[AppleMusicTrack Page] Init');

export const loadAppleMusicTracksSuccess = createAction(
  '[AppleMusicTrack/API] Load AppleMusicTrack Success',
  props<{ appleMusicTracks: AppleMusicTrack[] }>()
);

export const loadAppleMusicTracksFailure = createAction(
  '[AppleMusicTrack/API] Load AppleMusicTrack Failure',
  props<{ error: any }>()
);

export const refresh = createAction('[AppleMusicTrack Page] refresh');

export const refreshSuccess = createAction(
  '[AppleMusicTrack/API] refresh Success'
);

export const refreshFailure = createAction(
  '[AppleMusicTrack/API] refresh Failure',
  props<{ error: any }>()
);


export const setMoodFilter = createAction(
  '[AppleMusicTrack/API] Set Mood Filter',
  props<{ filters: string[] }>()
);

export const setSetFilter = createAction(
  '[AppleMusicTrack/API] Set Set Filter',
  props<{ filters: string[] }>()
);

export const setGenreFilter = createAction(
  '[AppleMusicTrack/API] Set Genre Filter',
  props<{ filters: string[] }>()
);
