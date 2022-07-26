import { Injectable } from '@angular/core';
import { AppleMusicFacade } from '@playlistr/fe/apple-music/data-access';
import { Observable } from 'rxjs';
import { AppleMusicTrack } from '@playlistr/shared/types';
import { Dictionary } from '@ngrx/entity';

@Injectable()
export class AppleMusicApi {
  allAppleMusicTracks$: Observable<AppleMusicTrack[]> =
    this.appleMusicFacade.allAppleMusicTracks$;
  allAppleMusicTracksDictionary$: Observable<Dictionary<AppleMusicTrack>> =
    this.appleMusicFacade.allAppleMusicTracksDictionary$;
  allMoods$: Observable<string[]> = this.appleMusicFacade.allMoods$;
  allSets$: Observable<string[]> = this.appleMusicFacade.allSets$;
  getAllGenres$: Observable<string[]> = this.appleMusicFacade.getAllGenres$;

  constructor(private appleMusicFacade: AppleMusicFacade) {}

  refresh() {
    this.appleMusicFacade.refresh();
  }
}
