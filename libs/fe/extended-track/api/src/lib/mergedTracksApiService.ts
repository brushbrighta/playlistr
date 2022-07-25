import { Injectable } from '@angular/core';
import { MergedTrackFacade } from '@playlistr/fe-extended-track-data-access';

@Injectable()
export class MergedTracksApiService {
  mergedTracksByAppleId$ = this.mergedTrackFacade.mergedTracksByAppleId$;

  constructor(private mergedTrackFacade: MergedTrackFacade) {}
}
