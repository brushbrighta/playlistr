import { Injectable } from '@angular/core';
import { AppleMusicApiService } from '@playlistr/fe/apple-music/api';
import { DiscogsReleasesApiService } from '@playlistr/fe-discogs-collection-api';
import { combineLatest, debounceTime, map, Observable } from 'rxjs';
import { MergedTracksApiService } from '@playlistr/fe-extended-track-api';
import { AppleMusicTrack, Release, Video } from '@playlistr/shared/types';

export interface ConductedTrack {
  id: number;
  title: string;
  artist: string;
  album: string;
  appleMusicTrack: AppleMusicTrack;
  video: Video | null;
  discogsRelease: Release | null;
}

@Injectable()
export class ConductedDataService {
  public conductedTracks$: Observable<ConductedTrack[]> = this.combineData();

  constructor(
    private appleMusicApiService: AppleMusicApiService,
    private discogsReleasesApiService: DiscogsReleasesApiService,
    private tracksApiService: MergedTracksApiService
  ) {}

  combineData(): Observable<ConductedTrack[]> {
    // @ts-ignore
    return combineLatest([
      this.tracksApiService.mergedTracksByAppleId$,
      this.appleMusicApiService.allAppleMusicTracks$,
      this.discogsReleasesApiService.allDiscogsReleaseDictionary$,
    ]).pipe(
      debounceTime(200),
      map(([mergedTracksDic, appleMusicTracks, discogsDic]) => {
        // @ts-ignore
        return appleMusicTracks.map((appleTrack) => {
          const discogsReleaseId =
            mergedTracksDic[appleTrack['Track ID']].discogsreleaseId;
          const video = mergedTracksDic[appleTrack['Track ID']].video;
          // @ts-ignore
          const discogsRelease: Release | null =
            discogsReleaseId && discogsDic[discogsReleaseId]
              ? discogsDic[discogsReleaseId]
              : null;

          return {
            id: appleTrack['Track ID'],
            title: appleTrack['Name'],
            artist: appleTrack['Artist'],
            album: appleTrack['Album'],
            appleMusicTrack: appleTrack,
            discogsRelease: discogsRelease,
            video: video || null,
          };
        });
      })
    );
  }

  combineDataWithFilters(): Observable<ConductedTrack[]> {
    return combineLatest([
      this.conductedTracks$,
      this.appleMusicApiService.getSetFilter$,
      this.appleMusicApiService.getMoodFilter$,
      this.appleMusicApiService.getGenreFilter,
    ]).pipe(
      debounceTime(200),
      map(([tracks, setFilter, moodFilter, genreFilter]) => {
        return tracks.filter((track) => {
          const am = track.appleMusicTrack;
          const filteredBySet = setFilter.length
            ? am &&
              am.Comments &&
              setFilter.some((w) => am.Comments.includes(w))
            : true;
          const filteredByMood = moodFilter.length
            ? am &&
              am.Comments &&
              moodFilter.some((w) => am.Comments.includes(w))
            : true;
          const filteredByGenre = genreFilter.length
            ? am && am.Genre && genreFilter.some((w) => am.Genre.includes(w))
            : true;
          return filteredBySet && filteredByMood && filteredByGenre;
        });
      })
    );
  }
}
