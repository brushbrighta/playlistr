import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrackFilterFacade } from '@playlistr/fe/track-filter/data-access';

@Injectable()
export class TrackFilterApi {
  getMoodFilter$: Observable<string[]> = this.trackFilterFacade.getMoodFilter$;
  getSetFilter$: Observable<string[]> = this.trackFilterFacade.getSetFilter$;
  getGenreFilter: Observable<string[]> = this.trackFilterFacade.getGenreFilter$;
  getVideoFilter$: Observable<boolean> = this.trackFilterFacade.getVideoFilter$;
  getSearchTerm$: Observable<string> = this.trackFilterFacade.getSearchTerm$;

  constructor(private trackFilterFacade: TrackFilterFacade) {}
}
