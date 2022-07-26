import { Injectable } from '@angular/core';
import { AppleMusicApi } from '@playlistr/fe/apple-music/api';
import { DiscogsReleasesApi } from '@playlistr/fe-discogs-collection-api';
import { combineLatest, debounceTime, filter, map, Observable } from 'rxjs';
import { MergedTracksApi } from '@playlistr/fe-extended-track-api';
import {
  AppleMusicTrack,
  Dictionary,
  MergedTrack,
  Release,
  Video,
} from '@playlistr/shared/types';
import { TrackFilterApi } from '@playlistr/fe/track-filter/api';

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
  public conductedTracksFiltered$: Observable<ConductedTrack[]> =
    this.combineDataWithFilters();

  constructor(
    private appleMusicApiService: AppleMusicApi,
    private discogsReleasesApiService: DiscogsReleasesApi,
    private tracksApiService: MergedTracksApi,
    private trackFilterApi: TrackFilterApi
  ) {}

  combineData(): Observable<ConductedTrack[]> {
    return combineLatest([
      this.tracksApiService.mergedTracksByAppleId$.pipe(
        filter((dic) => Object.keys(dic).length > 0)
      ),
      this.appleMusicApiService.allAppleMusicTracks$,
      this.discogsReleasesApiService.allDiscogsReleaseDictionary$,
    ]).pipe(
      // @ts-ignore
      debounceTime(200),
      map(
        ([mergedTracksDic, appleMusicTracks, discogsDic]: [
          Dictionary<MergedTrack>,
          AppleMusicTrack[],
          Dictionary<Release>
        ]) => {
          return appleMusicTracks.map((appleTrack) => {
            const discogsReleaseId =
              mergedTracksDic[appleTrack['Track ID']].discogsreleaseId;
            const video = mergedTracksDic[appleTrack['Track ID']].video;
            const discogsRelease: Release | null =
              discogsReleaseId && discogsDic[discogsReleaseId]
                ? discogsDic[discogsReleaseId]
                : null;
            if (appleTrack['Track ID'] === 23939) {
              console.log(
                'discogsRelease',
                discogsReleaseId,
                discogsDic[discogsReleaseId],
                mergedTracksDic[appleTrack['Track ID']]
              );
            }
            return {
              id: appleTrack['Track ID'],
              title: appleTrack['Name'],
              artist: appleTrack['Artist'],
              album: appleTrack['Album'],
              appleMusicTrack: appleTrack,
              discogsRelease,
              video: video || null,
            };
          });
        }
      )
    );
  }

  combineDataWithFilters(): Observable<ConductedTrack[]> {
    return combineLatest([
      this.conductedTracks$,
      this.trackFilterApi.getSetFilter$,
      this.trackFilterApi.getMoodFilter$,
      this.trackFilterApi.getGenreFilter,
      this.trackFilterApi.getVideoFilter$,
      this.trackFilterApi.getSearchTerm$,
    ]).pipe(
      debounceTime(200),
      map(
        ([
          tracks,
          setFilter,
          moodFilter,
          genreFilter,
          onlyVideo,
          searchTerm,
        ]) => {
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
            const filterByVideo = onlyVideo ? !!track.video : true;

            const filterByTerm =
              searchTerm && searchTerm.length
                ? (
                    track.appleMusicTrack.Album +
                    track.appleMusicTrack.Artist +
                    track.appleMusicTrack.Name
                  )
                    .toUpperCase()
                    .includes(searchTerm.toUpperCase())
                : true;
            return (
              filteredBySet &&
              filteredByMood &&
              filteredByGenre &&
              filterByVideo &&
              filterByTerm
            );
          });
        }
      )
    );
  }
}
