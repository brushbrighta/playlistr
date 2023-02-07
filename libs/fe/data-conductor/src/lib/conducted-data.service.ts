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

  loading$: Observable<boolean> = combineLatest([
    this.tracksApiService.loading$,
    this.discogsReleasesApiService.loading$,
  ]).pipe(map(([a, b]) => a || b));

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
          return appleMusicTracks
            .map((appleTrack) => {
              const discogsReleaseId =
                mergedTracksDic[appleTrack['Track ID']].discogsreleaseId;
              const video = mergedTracksDic[appleTrack['Track ID']].video;
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
                discogsRelease,
                video: video || null,
              };
            })
            .sort((a, b) => {
              const aValue =
                a.discogsRelease && a.discogsRelease.community.rating.count > 10
                  ? a.discogsRelease.community.rating.average
                  : 0;
              const bValue =
                b.discogsRelease && b.discogsRelease.community.rating.count > 10
                  ? b.discogsRelease.community.rating.average
                  : 0;
              return bValue - aValue;
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
      this.trackFilterApi.getOnlyFavoritesFilter$,
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
          onlyFavs,
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

            const filterByFavOnly = onlyFavs
              ? track.appleMusicTrack.Loved === ''
              : true;

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
              filterByTerm &&
              filterByFavOnly
            );
          });
        }
      )
    );
  }
}
