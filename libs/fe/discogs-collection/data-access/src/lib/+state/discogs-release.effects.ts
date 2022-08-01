import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, OnInitEffects } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import * as DiscogsReleaseActions from './discogs-release.actions';
import { CollectionApiService } from '@playlistr/fe/api';
import { debounceTime, map } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class DiscogsReleaseEffects implements OnInitEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscogsReleaseActions.init),
      fetch({
        run: (action) => {
          return this.collectionApiService.getCollection().pipe(
            map((discogsRelease) =>
              DiscogsReleaseActions.loadDiscogsReleaseSuccess({
                discogsRelease,
              })
            )
          );
        },
        onError: (action, error) => {
          console.error('Error', error);
          return DiscogsReleaseActions.loadDiscogsReleaseFailure({ error });
        },
      })
    )
  );

  fetchImageForRelease$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscogsReleaseActions.fetchImage),
      fetch({
        run: ({ releaseId }) => {
          return this.collectionApiService
            .fetchImageForRelease(releaseId)
            .pipe(
              map((discogsRelease) => DiscogsReleaseActions.fetchImageSuccess())
            );
        },
        onError: (action, error) => {
          console.error('Error', error);
          return DiscogsReleaseActions.fetchImageFailure();
        },
      })
    )
  );

  refreshRelease$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiscogsReleaseActions.refreshRelease),
      fetch({
        run: ({ releaseId }) => {
          return this.collectionApiService
            .refreshRelease(releaseId)
            .pipe(
              map((discogsRelease) =>
                DiscogsReleaseActions.refreshReleaseSuccess()
              )
            );
        },
        onError: (action, error) => {
          console.error('Error', error);
          return DiscogsReleaseActions.refreshReleaseFailure();
        },
      })
    )
  );

  reloadAfterSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DiscogsReleaseActions.fetchImageSuccess,
        DiscogsReleaseActions.refreshReleaseSuccess
      ),
      debounceTime(500),
      map((_) => DiscogsReleaseActions.init())
    )
  );

  ngrxOnInitEffects(): Action {
    return DiscogsReleaseActions.init();
  }

  constructor(
    private readonly actions$: Actions,
    private collectionApiService: CollectionApiService
  ) {}
}
