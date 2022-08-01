import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Release } from '@playlistr/shared/types';
import { DiscogsReleaseFacade } from '@playlistr/fe-discogs-collection-data-access';
import { Dictionary } from '@ngrx/entity';

@Injectable()
export class DiscogsReleasesApi {
  allDiscogsRelease$: Observable<Release[]> =
    this.discogsReleaseFacade.allDiscogsRelease$;
  allDiscogsReleaseDictionary$: Observable<Dictionary<Release>> =
    this.discogsReleaseFacade.allDiscogsReleaseDictionary$;

  constructor(private discogsReleaseFacade: DiscogsReleaseFacade) {}

  fetchImage(releaseId: number) {
    this.discogsReleaseFacade.fetchImage(releaseId);
  }

  refreshRelease(releaseId: number) {
    this.discogsReleaseFacade.refreshRelease(releaseId);
  }
}
