import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as MergedTrackActions from './merged-track.actions';
import * as MergedTrackSelectors from './merged-track.selectors';
import { Observable } from 'rxjs';
import { MergedTrack } from '@playlistr/shared/types';

@Injectable()
export class MergedTrackFacade {
  loaded$: Observable<boolean> = this.store.pipe(
    select(MergedTrackSelectors.getMergedTracksLoaded)
  );
  allMergedTracks$: Observable<MergedTrack[]> = this.store.pipe(
    select(MergedTrackSelectors.getAllMergedTracks)
  );
  selectedMergedTrack$: Observable<MergedTrack | undefined> = this.store.pipe(
    select(MergedTrackSelectors.getSelected)
  );

  constructor(private readonly store: Store) {}

  init() {
    this.store.dispatch(MergedTrackActions.init());
  }
}
