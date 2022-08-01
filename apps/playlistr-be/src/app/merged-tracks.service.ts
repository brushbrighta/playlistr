import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  combineLatest,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

import {
  AppleMusicTrack,
  MergedTrack,
  Release,
  ReleaseTrack,
  Video,
} from '@playlistr/shared/types';
import { DataAccessService } from './data-access/data.access.service';
import { DiscogsCollectionService } from './discogs/discogs-collection.service';
import { AppleMusicService } from './apple-music/apple-music.service';
const stringSimilarity = require('string-similarity');

interface FlatDiscogsTracklistItem {
  artist: string;
  title: string;
  discogsId: number;
}

@Injectable()
export class MergedTracksService {
  userName = 'nikolaj_bremen';
  constructor(
    private httpService: HttpService,
    private dataAccessService: DataAccessService,
    private retrieveDiscogsCollectionService: DiscogsCollectionService,
    private retrieveAppleMusicService: AppleMusicService
  ) {}

  private findVideo(
    artistName: string,
    trackName: string,
    videos: Video[],
    otherTrackNames: string[]
  ): Video | null {
    // Logger.log('compare ', trackName, '-', otherTrackNames.join(', '));
    if (!videos) {
      return null;
    }
    const videoNames = videos.map((v) => this.normalizeName(v.title));
    const string = this.normalizeName(trackName);
    const result = stringSimilarity.findBestMatch(string, videoNames);

    const score = result.bestMatch.rating;
    const bestMatchingVideoTitle = videos[result.bestMatchIndex].title;

    const otherResult = otherTrackNames.length
      ? stringSimilarity.findBestMatch(
          bestMatchingVideoTitle,
          otherTrackNames.map((s) => this.normalizeName(s))
        )
      : { bestMatch: { rating: 0 } };
    //
    // const otherResults = otherTrackNames
    //   .map((otherTrack) =>
    //     stringSimilarity.findBestMatch(otherTrack, videoNames)
    //   )
    //   .map((result) => result.bestMatch.rating);
    //
    // const otherResultsMax = Math.max(...otherResults);

    // console.log('otherResultsMax', otherResult.bestMatch.rating);
    // console.log('result.bestMatch.rating', result.bestMatch.rating);
    const bestMatch =
      score > otherResult.bestMatch.rating
        ? videos[result.bestMatchIndex]
        : null;

    return bestMatch;
  }

  // private findAppleMusic(
  //   artistName: string,
  //   trackName: string,
  //   tracksApple: any[]
  // ): any | null {
  //   if (!tracksApple) {
  //     return null;
  //   }
  //   const appleMusicNames = tracksApple.map((v) =>
  //     (v.Artist + ' ' + v.Name).replace(/[^a-zA-Z]/g, '').toUpperCase()
  //   );
  //   const string = (artistName + ' ' + trackName)
  //     .replace(/[^a-zA-Z]/g, '')
  //     .toUpperCase();
  //   const result = stringSimilarity.findBestMatch(string, appleMusicNames);
  //   const bestMatch =
  //     result.bestMatch.rating > 0.49
  //       ? tracksApple[result.bestMatchIndex]
  //       : null;
  //
  //   return bestMatch ? bestMatch['Track ID'] : null;
  // }

  private normalizeName(string): string {
    return string.replace(/[^a-zA-Z]/g, '_').toUpperCase();
  }

  private findDiscogsReleaseByApple(
    track: AppleMusicTrack,
    allDiscogs: Release[],
    flattenedDiscogsTracks: FlatDiscogsTracklistItem[],
    flattenedAppleTracks: string[]
  ) {
    // early return
    const oneExactlyMatchingTracksInDiscogs = flattenedDiscogsTracks.filter(
      (_track) =>
        this.normalizeName(_track.title) === this.normalizeName(track.Name)
    );

    const isOnlyWithThisNameInApple =
      flattenedAppleTracks.filter((t) => t === track.Name).length === 1;

    if (
      oneExactlyMatchingTracksInDiscogs.length === 1 &&
      isOnlyWithThisNameInApple
    ) {
      // could include artist to handle small amounts of matching items
      return allDiscogs.find(
        (release) =>
          release.id === oneExactlyMatchingTracksInDiscogs[0].discogsId
      );
    }
    // early return end

    const discogsReleaseNames = allDiscogs.map((v) =>
      this.normalizeName(v.artists_sort + ' ' + v.title)
    );

    const appleName = this.normalizeName(
      track['Album Artist'] + ' ' + track['Album']
    );

    const result = stringSimilarity.findBestMatch(
      appleName,
      discogsReleaseNames
    );
    let bestMatch: Release =
      result.bestMatch.rating > 0.6 ? allDiscogs[result.bestMatchIndex] : null;

    // another try
    if (!bestMatch) {
      const appleByTrack = this.normalizeName(
        track['Album Artist'] + ' ' + track['Name']
      );
      const discogsTitleNames = flattenedDiscogsTracks.map((v) =>
        this.normalizeName(v.artist + ' ' + v.title)
      );
      const resultHere = stringSimilarity.findBestMatch(
        appleByTrack,
        discogsTitleNames
      );
      bestMatch =
        result.bestMatch.rating > 0.6
          ? allDiscogs[
              flattenedDiscogsTracks[resultHere.bestMatchIndex].discogsId
            ]
          : null;
    }

    return bestMatch;
  }

  // private extractTrackFromReleaseByDiscogs(
  //   release: Release,
  //   tracksApple: AppleMusicTrack[]
  // ): MergedTrack[] {
  //   return release.tracklist.map((track: ReleaseTrack, index): MergedTrack => {
  //     return {
  //       id: release.id + '_' + track.position,
  //       discogsreleaseId: release.id,
  //       discogsIndex: index,
  //       appleMusicTrackId: this.findAppleMusic(
  //         track.artists && track.artists.length
  //           ? track.artists[0].name
  //           : release.artists[0].name,
  //         track.title,
  //         tracksApple
  //       ),
  //       video: this.findVideo(
  //         release.artists_sort,
  //         track.title,
  //         release.videos,
  //         [] // todo
  //       ),
  //     };
  //   });
  // }

  private extractTrackFromReleaseByApple(
    track: AppleMusicTrack,
    allDiscogs: Release[],
    otherTracksOnRelease: AppleMusicTrack[],
    flattenedDiscogsTracks: FlatDiscogsTracklistItem[],
    flattenedAppleTracks: string[]
  ): MergedTrack {
    const discogs = this.findDiscogsReleaseByApple(
      track,
      allDiscogs,
      flattenedDiscogsTracks,
      flattenedAppleTracks
    );
    return {
      id: track['Track ID'],
      appleMusicTrackId: track['Track ID'],
      discogsreleaseId: discogs ? discogs.id : null,
      discogsIndex: null,
      video: discogs
        ? this.findVideo(
            '',
            track.Name,
            discogs ? discogs.videos : null,
            otherTracksOnRelease.map((t) => t.Name)
          )
        : null,
    };

    // return release.tracklist.map((track: ReleaseTrack, index): MergedTrack => {
    //   return {
    //     id: release.id + '_' + track.position,
    //     discogsreleaseId: release.id,
    //     discogsIndex: index,
    //     appleMusicTrackId: this.findAppleMusic(
    //       track.artists && track.artists.length
    //         ? track.artists[0].name
    //         : release.artists[0].name,
    //       track.title,
    //       tracksApple
    //     ),
    //     video: this.findVideo(
    //       release.artists_sort,
    //       track.title,
    //       release.videos
    //     ),
    //   };
    // });
  }

  private otherFromSameRelease(
    track: AppleMusicTrack,
    allTracks: AppleMusicTrack[]
  ): AppleMusicTrack[] {
    return allTracks.filter(
      (_track) =>
        _track['Track ID'] !== track['Track ID'] &&
        track['Album'] === _track['Album']
    );
  }

  private flattenedDiscogsTracklist(
    releases: Release[]
  ): FlatDiscogsTracklistItem[] {
    return releases.reduce((prev, curr) => {
      return [
        ...prev,
        ...curr.tracklist.map((track) => ({
          title: track.title,
          artist: curr.artists_sort,
          discogsId: curr.id,
        })),
      ];
    }, [] as FlatDiscogsTracklistItem[]);
  }

  private makeTrackList(
    releases$: Observable<Release[]>,
    appleMusicTracks$: Observable<AppleMusicTrack[]>
  ): Observable<MergedTrack[]> {
    return combineLatest([releases$, appleMusicTracks$]).pipe(
      filter(
        ([releases, tracksApple]) =>
          // wait till both list contain data
          releases.length > 0 && tracksApple.length > 0
      ),
      map(([releases, tracksApple]) => {
        const flattenedDiscogsTracklist =
          this.flattenedDiscogsTracklist(releases);

        const flattenedAppleTracklist = tracksApple.map((t) => t.Name);

        return tracksApple.map((appleTrack) =>
          this.extractTrackFromReleaseByApple(
            appleTrack,
            releases,
            this.otherFromSameRelease(appleTrack, tracksApple),
            flattenedDiscogsTracklist,
            flattenedAppleTracklist
          )
        );
        // return releases.reduce((prev, curr, currentIndex) => {
        //   return [...prev, ...this.extractTrackFromReleaseByDiscogs(curr, tracksApple)];
        // }, []);
      })
    );
  }

  private sanitizeAlbum(
    result: MergedTrack[],
    appleMusicTracks: AppleMusicTrack[]
  ): MergedTrack[] {
    // group by video ... find bestMatch in eachGroup
    return result;
  }

  private sanitizeVideo(
    result: MergedTrack[],
    appleMusicTracks: AppleMusicTrack[]
  ): MergedTrack[] {
    let beforevideos = 0;

    const mapByVideo = result.reduce((prev, curr) => {
      // early return
      if (!curr.video) {
        return prev;
      }
      beforevideos++;
      // not exist
      if (!prev[curr.video.uri]) {
        return {
          ...prev,
          [curr.video.uri]: [curr],
        };
      }
      // exists
      else if (!!prev[curr.video.uri]) {
        return {
          ...prev,
          [curr.video.uri]: [...prev[curr.video.uri], curr],
        };
      }
    }, {});

    console.log('beforevideos count', beforevideos);
    let removeVideoFromHere = [];

    console.log('unique videos', Object.keys(mapByVideo).length);

    Object.keys(mapByVideo).forEach((key) => {
      if (mapByVideo[key].length > 1) {
        const titles = mapByVideo[key].map((data) => {
          const appleTrack = appleMusicTracks.find(
            (t) => t['Track ID'] === data.appleMusicTrackId
          );
          if (!appleTrack) {
            console.log('==========');
            console.log(mapByVideo[key]);
          }
          const res = appleTrack.Artist + ' ' + appleTrack.Name;
          return res;
        });

        const res = stringSimilarity.findBestMatch(
          mapByVideo[key][0].video.title,
          titles
        );
        const index = res.bestMatchIndex;
        const allOther = mapByVideo[key]
          .filter((_, _index) => _index !== index)
          .map((data) => data.id);

        removeVideoFromHere = [...removeVideoFromHere, ...allOther];
      }
    });

    console.log('removeVideoFromHere', removeVideoFromHere.length);

    let realRemove = 0;
    const _cleanedUpResult = result.map((res: MergedTrack) => {
      const shouldRemove =
        removeVideoFromHere.indexOf(res.appleMusicTrackId) > -1;
      realRemove += shouldRemove ? 1 : 0;
      const video = shouldRemove ? null : res.video;
      return {
        ...res,
        video,
      };
    });
    console.log('realRemove', realRemove);
    return _cleanedUpResult;
  }

  async getTracks(): Promise<Observable<MergedTrack[]>> {
    const tracksJsonRaw = this.dataAccessService.getCollectionTracksJson();
    const tracksJson =
      tracksJsonRaw && tracksJsonRaw.length ? JSON.parse(tracksJsonRaw) : '';
    if (tracksJson && tracksJson.length) {
      return of(tracksJson);
    }
    // const am = await this.retrieveAppleMusicService.getAppleMusicJson();
    return this.makeTrackList(
      this.retrieveDiscogsCollectionService.getCollection(),
      this.retrieveAppleMusicService.getAppleMusicJson()
    ).pipe(
      switchMap((result) => {
        return combineLatest([
          of(result),
          this.retrieveAppleMusicService.getAppleMusicJson(),
        ]).pipe(
          map(([_result, appleTracks]) => {
            return this.sanitizeVideo(_result, appleTracks);
          })
        );
      }),
      tap((result) => {
        Logger.log('Parseed items');
        this.dataAccessService.writeCollectionTracksJson(result);
      })
    );
  }
}
