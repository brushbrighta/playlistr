import {Injectable} from "@angular/core";
import {AppleMusicTrack, MergedTrack, Release, ReleaseTrack} from "@playlistr/shared/types";
import {MergedTrackFacade} from "@playlistr/fe/tracks/data-access";
import {AppleMusicApiService} from "@playlistr/fe/apple-music/api";
import {DiscogsReleasesApiService} from "@playlistr/fe/collection/api";
import {combineLatest, debounceTime, map, Observable} from "rxjs";

export interface CombinedTrack {
  id: string,
  track: MergedTrack,
  discogsRelease?:  Release;
  discogsTrack?: ReleaseTrack,
  appleMusicTrack?: AppleMusicTrack
}

@Injectable()
export class MergedTracksService {

  private getTracks$: Observable<CombinedTrack[]> = this.combineData();
  private getFilteredTracks$: Observable<CombinedTrack[]> = this.combineDataWithFilters();

  constructor(
    private mergedTrackFacade: MergedTrackFacade,
    private appleMusicApiService: AppleMusicApiService,
    private discogsReleasesApiService: DiscogsReleasesApiService
  ) {
  }

  combineData(): Observable<CombinedTrack[]> {
    return combineLatest(
      [
        this.mergedTrackFacade.allMergedTracks$,
        this.appleMusicApiService.allAppleMusicTracksDictionary$,
        this.discogsReleasesApiService.allDiscogsReleaseDictionary$
      ]
    ).pipe(
      debounceTime(200),
      map(([tracks, appleMusicDic, discogsDic]) => {
      return tracks.map((track => ({
        id: track.id,
        track,
        discogsRelease: discogsDic[track.discogsreleaseId],
        discogsTrack: discogsDic[track.discogsreleaseId]?.tracklist[track.discogsIndex],
        appleMusicTrack: appleMusicDic[track.appleMusicTrackId]
      })))

    }))
  }

  combineDataWithFilters(): Observable<CombinedTrack[]> {
    return combineLatest(
      [
        this.getTracks$,
        this.appleMusicApiService.getSetFilter$,
        this.appleMusicApiService.getMoodFilter$,
        this.appleMusicApiService.getGenreFilter,
      ]
    ).pipe(
      debounceTime(200),
      map(([tracks, setFiler, moodFiler, genreFilter]) => {
      return tracks.filter((track => {
        const am = track.appleMusicTrack;
        const commentFilters = [...setFiler, ...moodFiler];
        const filteredByComment = commentFilters.length ? am && am.Comments && commentFilters.every(w => am.Comments.includes(w)) : true;
        const filteredByGenre = genreFilter.length ? am && am.Genre && genreFilter.every(w => am.Genre.includes(w)) : true;
        return filteredByComment && filteredByGenre;
      }))

    }))
  }
}
