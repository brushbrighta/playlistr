import { createAction, props } from '@ngrx/store';
import { Release } from '@playlistr/shared/types';

export const init = createAction('[DiscogsRelease Page] Init');

export const loadDiscogsReleaseSuccess = createAction(
  '[DiscogsRelease/API] Load DiscogsRelease Success',
  props<{ discogsRelease: Release[] }>()
);

export const fetchImage = createAction(
  '[DiscogsRelease/API] Fetch image',
  props<{ releaseId: number }>()
);

export const fetchImageSuccess = createAction(
  '[DiscogsRelease/API] Fetch image Success'
);

export const fetchImageFailure = createAction(
  '[DiscogsRelease/API] Fetch image Failure'
);

export const refreshRelease = createAction(
  '[DiscogsRelease/API] Fetch image',
  props<{ releaseId: number }>()
);

export const refreshReleaseSuccess = createAction(
  '[DiscogsRelease/API] Fetch image Success'
);

export const refreshReleaseFailure = createAction(
  '[DiscogsRelease/API] Fetch image Failure'
);

export const loadDiscogsReleaseFailure = createAction(
  '[DiscogsRelease/API] Load DiscogsRelease Failure',
  props<{ error: any }>()
);
