import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as DiscogsReleaseActions from './discogs-release.actions';
import * as DiscogsReleaseSelectors from './discogs-release.selectors';

@Injectable()
export class DiscogsReleaseFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(
    select(DiscogsReleaseSelectors.getDiscogsReleaseLoaded)
  );
  allDiscogsRelease$ = this.store.pipe(
    select(DiscogsReleaseSelectors.getAllDiscogsRelease)
  );
  allDiscogsReleaseDictionary$ = this.store.pipe(
    select(DiscogsReleaseSelectors.getDiscogsReleaseEntities)
  );
  selectedDiscogsRelease$ = this.store.pipe(
    select(DiscogsReleaseSelectors.getSelected)
  );

  constructor(private readonly store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(DiscogsReleaseActions.init());
  }

  fetchImage(releaseId: number) {
    this.store.dispatch(DiscogsReleaseActions.fetchImage({ releaseId }));
  }
}
