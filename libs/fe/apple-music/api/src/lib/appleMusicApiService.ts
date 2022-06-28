import { Injectable } from '@angular/core';
import { AppleMusicFacade } from '@playlistr/fe/apple-music/data-access';
import { Observable } from 'rxjs';
import { AppleMusicTrack } from '@playlistr/shared/types';
import {Dictionary} from "@ngrx/entity";

@Injectable()
export class AppleMusicApiService {
  allAppleMusicTracks$: Observable<AppleMusicTrack[]> = this.appleMusicFacade.allAppleMusicTracks$;
  allAppleMusicTracksDictionary$: Observable<Dictionary<AppleMusicTrack>> = this.appleMusicFacade.allAppleMusicTracksDictionary$;
  getMoodFilter$: Observable<string[]> = this.appleMusicFacade.getMoodFilter$;
  getSetFilter$: Observable<string[]> = this.appleMusicFacade.getSetFilter$;
  getGenreFilter: Observable<string[]> = this.appleMusicFacade.getGenreFilter$;
  allMoods$: Observable<string[]> = this.appleMusicFacade.allMoods$;
  allSets$: Observable<string[]> = this.appleMusicFacade.allSets$;
  getAllGenres$: Observable<string[]> = this.appleMusicFacade.getAllGenres$;


  constructor(private appleMusicFacade: AppleMusicFacade) {}

  setSetsFilter(filters: string[]) {
    this.appleMusicFacade.setSetFilter(filters);
  }

  setMoodFilter(filters: string[]) {
    this.appleMusicFacade.setMoodFilter(filters);
  }

  setGenreFilter(filters: string[]) {
    this.appleMusicFacade.setGenreFilter(filters);
  }
}
