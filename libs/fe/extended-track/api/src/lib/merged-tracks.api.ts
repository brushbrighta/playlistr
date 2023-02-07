import { Injectable } from '@angular/core';
import { MergedTrackFacade } from '@playlistr/fe-extended-track-data-access';
import { Observable } from 'rxjs';
import { Dictionary, MergedTrack } from '@playlistr/shared/types';

@Injectable()
export class MergedTracksApi {
  mergedTracksByAppleId$: Observable<Dictionary<MergedTrack>> =
    this.mergedTrackFacade.mergedTracksByAppleId$;
  loading$ = this.mergedTrackFacade.loading$;

  constructor(private mergedTrackFacade: MergedTrackFacade) {}
}
