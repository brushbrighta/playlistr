import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, OnInitEffects } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import * as MergedTrackActions from './merged-track.actions';
import { TracksApiService } from '@playlistr/fe/api';
import { map } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class MergedTrackEffects implements OnInitEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MergedTrackActions.init),
      fetch({
        run: (action) => {
          return this.MergedTracksApiService.getTracks().pipe(
            map((MergedTracks) =>
              MergedTrackActions.loadMergedTracksSuccess({
                MergedTracks,
              })
            )
          );
        },
        onError: (action, error) => {
          console.error('Error', error);
          return MergedTrackActions.loadMergedTracksFailure({ error });
        },
      })
    )
  );

  ngrxOnInitEffects(): Action {
    return MergedTrackActions.init();
  }

  constructor(
    private readonly actions$: Actions,
    private MergedTracksApiService: TracksApiService
  ) {}
}
