import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as AppleMusicActions from './apple-music.actions';
import * as AppleMusicSelectors from './apple-music.selectors';
import { Observable } from 'rxjs';
import { AppleMusicTrack } from '@playlistr/shared/types';

@Injectable()
export class AppleMusicFacade {
  loaded$: Observable<boolean> = this.store.pipe(
    select(AppleMusicSelectors.getAppleTracksLoaded)
  );
  allAppleMusicTracks$: Observable<AppleMusicTrack[]> = this.store.pipe(
    select(AppleMusicSelectors.getAllAppleTracks)
  );
  selectedAppleMusicTrack$: Observable<AppleMusicTrack | undefined> =
    this.store.pipe(select(AppleMusicSelectors.getSelected));

  constructor(private readonly store: Store) {}

  init() {
    this.store.dispatch(AppleMusicActions.init());
  }
}
