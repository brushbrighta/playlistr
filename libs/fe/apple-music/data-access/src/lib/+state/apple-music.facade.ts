import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as AppleMusicActions from './apple-music.actions';
import * as AppleMusicSelectors from './apple-music.selectors';
import { Observable } from 'rxjs';
import { AppleMusicTrack } from '@playlistr/shared/types';
import { Dictionary } from '@ngrx/entity';
import { getAllGenres } from './apple-music.selectors';

@Injectable()
export class AppleMusicFacade {
  loaded$: Observable<boolean> = this.store.pipe(
    select(AppleMusicSelectors.getAppleTracksLoaded)
  );
  allAppleMusicTracks$: Observable<AppleMusicTrack[]> = this.store.pipe(
    select(AppleMusicSelectors.getAllAppleTracks)
  );
  allAppleMusicTracksDictionary$: Observable<Dictionary<AppleMusicTrack>> =
    this.store.pipe(select(AppleMusicSelectors.getAllAppleTracksEntities));

  allMoods$: Observable<string[]> = this.store.pipe(
    select(AppleMusicSelectors.getAllMoods)
  );
  allSets$: Observable<string[]> = this.store.pipe(
    select(AppleMusicSelectors.getAllSets)
  );
  getAllGenres$: Observable<string[]> = this.store.pipe(
    select(AppleMusicSelectors.getAllGenres)
  );

  selectedAppleMusicTrack$: Observable<AppleMusicTrack | undefined> =
    this.store.pipe(select(AppleMusicSelectors.getSelected));

  constructor(private readonly store: Store) {}

  init() {
    this.store.dispatch(AppleMusicActions.init());
  }

  refresh() {
    this.store.dispatch(AppleMusicActions.refresh());
  }
}
