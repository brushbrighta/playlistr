import { Injectable } from '@angular/core';
import { AppleMusicFacade } from '@playlistr/fe/apple-music/data-access';
import { Observable } from 'rxjs';
import { AppleMusicTrack } from '@playlistr/shared/types';

@Injectable()
export class AppleMusicApiService {
  allAppleMusicTracks$: Observable<AppleMusicTrack[]> =
    this.appleMusicFacade.allAppleMusicTracks$;

  constructor(private appleMusicFacade: AppleMusicFacade) {}
}
