import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as TrackFilterActions from './track-filter.actions';
import * as TrackFilterSelectors from './track-filter.selectors';
import { Observable } from 'rxjs';

@Injectable()
export class TrackFilterFacade {
  getMoodFilter$: Observable<string[]> = this.store.pipe(
    select(TrackFilterSelectors.getMoodFilter)
  );
  getSetFilter$: Observable<string[]> = this.store.pipe(
    select(TrackFilterSelectors.getSetFilter)
  );
  getGenreFilter$: Observable<string[]> = this.store.pipe(
    select(TrackFilterSelectors.getGenreFilter)
  );
  getVideoFilter$: Observable<boolean> = this.store.pipe(
    select(TrackFilterSelectors.getVideoFilter)
  );
  getSearchTerm$: Observable<string> = this.store.pipe(
    select(TrackFilterSelectors.getSearchTerm)
  );

  constructor(private readonly store: Store) {}

  setMoodFilter(filters: string[]) {
    this.store.dispatch(TrackFilterActions.setMoodFilter({ filters }));
  }

  setSetFilter(filters: string[]) {
    this.store.dispatch(TrackFilterActions.setSetFilter({ filters }));
  }

  setGenreFilter(filters: string[]) {
    this.store.dispatch(TrackFilterActions.setGenreFilter({ filters }));
  }

  setVideoFilter(onlyWithVideos: boolean) {
    this.store.dispatch(TrackFilterActions.setVideoFilter({ onlyWithVideos }));
  }

  setSearchTerm(searchTerm: string) {
    this.store.dispatch(TrackFilterActions.setSearchTerm({ searchTerm }));
  }
}
