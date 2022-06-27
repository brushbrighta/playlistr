import { createAction, props } from '@ngrx/store';
import { MergedTrack } from '@playlistr/shared/types';

export const init = createAction('[MergedTrack Page] Init');

export const loadMergedTracksSuccess = createAction(
  '[MergedTrack/API] Load MergedTrack Success',
  props<{ MergedTracks: MergedTrack[] }>()
);

export const loadMergedTracksFailure = createAction(
  '[MergedTrack/API] Load MergedTrack Failure',
  props<{ error: any }>()
);
