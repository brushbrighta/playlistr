import { Injectable } from '@angular/core';
import { MergedTrackFacade } from '@playlistr/fe/tracks/data-access';

@Injectable()
export class MergedTracksApiService {
  mergedTracksByAppleId$ = this.mergedTrackFacade.mergedTracksByAppleId$;
  constructor(private mergedTrackFacade: MergedTrackFacade) {}
}
