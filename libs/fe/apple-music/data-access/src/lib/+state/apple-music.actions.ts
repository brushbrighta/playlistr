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
