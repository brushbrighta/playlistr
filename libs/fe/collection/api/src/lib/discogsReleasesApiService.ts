import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Release } from '@playlistr/shared/types';
import { DiscogsReleaseFacade } from '@playlistr/fe/collection/data-access';

@Injectable()
export class DiscogsReleasesApiService {
  allDiscogsRelease$: Observable<Release[]> =
    this.discogsReleaseFacade.allDiscogsRelease$;

  constructor(private discogsReleaseFacade: DiscogsReleaseFacade) {}
}
