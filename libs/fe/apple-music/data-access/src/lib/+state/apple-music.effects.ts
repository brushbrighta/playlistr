import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, OnInitEffects } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import * as AppleMusicActions from './apple-music.actions';
import { AppleMusicTracksApiService } from '@playlistr/fe/api';
import { map } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class AppleMusicEffects implements OnInitEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppleMusicActions.init),
      fetch({
        run: (action) => {
          return this.appleMusicTracksApiService.getAppleMusicTracks().pipe(
            map((appleMusicTracks) =>
              AppleMusicActions.loadAppleMusicTracksSuccess({
                appleMusicTracks,
              })
            )
          );
        },
        onError: (action, error) => {
          console.error('Error', error);
          return AppleMusicActions.loadAppleMusicTracksFailure({ error });
        },
      })
    )
  );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppleMusicActions.refresh),
      fetch({
        run: (action) => {
          return this.appleMusicTracksApiService.refreshAppleMusicTracks().pipe(
            map((_) =>
              AppleMusicActions.refreshSuccess()
            )
          );
        },
        onError: (action, error) => {
          return AppleMusicActions.refreshFailure({ error });
        },
      })
    )
  );

  afterRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppleMusicActions.refreshSuccess),
    map(_ => AppleMusicActions.init()))
  )

  ngrxOnInitEffects(): Action {
    return AppleMusicActions.init();
  }

  constructor(
    private readonly actions$: Actions,
    private appleMusicTracksApiService: AppleMusicTracksApiService
  ) {}
}
