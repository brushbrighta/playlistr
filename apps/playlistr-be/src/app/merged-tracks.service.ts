import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { combineLatest, filter, map, Observable, of, tap } from 'rxjs';

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
    const videoNames = videos.map((v) => v.title);
    const string = trackName;
    const result = stringSimilarity.findBestMatch(string, videoNames);

    const score = result.bestMatch.rating;
    const bestMatchingVideoTitle = videos[result.bestMatchIndex].title;

    const otherResult = otherTrackNames.length
      ? stringSimilarity.findBestMatch(bestMatchingVideoTitle, otherTrackNames)
      : { bestMatch: { rating: 0 } };
    //
    // const otherResults = otherTrackNames
    //   .map((otherTrack) =>
    //     stringSimilarity.findBestMatch(otherTrack, videoNames)
    //   )
    //   .map((result) => result.bestMatch.rating);
    //
    // const otherResultsMax = Math.max(...otherResults);

    console.log('otherResultsMax', otherResult.bestMatch.rating);
    console.log('result.bestMatch.rating', result.bestMatch.rating);
    const bestMatch =
      score > otherResult.bestMatch.rating
        ? videos[result.bestMatchIndex]
        : null;
    Logger.log(`video found match: ${bestMatch !== null}`);

    return bestMatch;
  }

  private findAppleMusic(
    artistName: string,
    trackName: string,
    tracksApple: any[]
  ): any | null {
    if (!tracksApple) {
      return null;
    }
    const appleMusicNames = tracksApple.map((v) =>
      (v.Artist + ' ' + v.Name).replace(/[^a-zA-Z]/g, '_')
    );
    const string = (artistName + ' ' + trackName).replace(/[^a-zA-Z]/g, '_');
    const result = stringSimilarity.findBestMatch(string, appleMusicNames);
    const bestMatch =
      result.bestMatch.rating > 0.49
        ? tracksApple[result.bestMatchIndex]
        : null;

    return bestMatch ? bestMatch['Track ID'] : null;
  }

  private findDiscogsReleaseByApple(
    track: AppleMusicTrack,
    allDiscogs: Release[]
  ) {
    const discogsReleaseNames = allDiscogs.map((v) =>
      (v.artists_sort + ' ' + v.title).replace(/[^a-zA-Z]/g, '_')
    );
    const appleName = (track['Album Artist'] + ' ' + track['Album']).replace(
      /[^a-zA-Z]/g,
      '_'
    );
    const result = stringSimilarity.findBestMatch(
      appleName,
      discogsReleaseNames
    );
    const bestMatch =
      result.bestMatch.rating > 0.6 ? allDiscogs[result.bestMatchIndex] : null;
    return bestMatch;
  }

  private extractTrackFromReleaseByDiscogs(
    release: Release,
    tracksApple: AppleMusicTrack[]
  ): MergedTrack[] {
    return release.tracklist.map((track: ReleaseTrack, index): MergedTrack => {
      return {
        id: release.id + '_' + track.position,
        discogsreleaseId: release.id,
        discogsIndex: index,
        appleMusicTrackId: this.findAppleMusic(
          track.artists && track.artists.length
            ? track.artists[0].name
            : release.artists[0].name,
          track.title,
          tracksApple
        ),
        video: this.findVideo(
          release.artists_sort,
          track.title,
          release.videos,
          [] // todo
        ),
      };
    });
  }

  private extractTrackFromReleaseByApple(
    track: AppleMusicTrack,
    allDiscogs: Release[],
    otherTracksOnRelease: AppleMusicTrack[]
  ): MergedTrack {
    const discogs = this.findDiscogsReleaseByApple(track, allDiscogs);
    return {
      id: track['Track ID'] + '',
      appleMusicTrackId: track['Track ID'],
      discogsreleaseId: discogs ? discogs.id : null,
      discogsIndex: null,
      video: this.findVideo(
        '',
        track.Name,
        discogs ? discogs.videos : null,
        otherTracksOnRelease.map((t) => t.Name)
      ),
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
        return tracksApple.map((appleTrack) =>
          this.extractTrackFromReleaseByApple(
            appleTrack,
            releases,
            this.otherFromSameRelease(appleTrack, tracksApple)
          )
        );
        // return releases.reduce((prev, curr, currentIndex) => {
        //   return [...prev, ...this.extractTrackFromReleaseByDiscogs(curr, tracksApple)];
        // }, []);
      })
    );
  }

  async getTracks(): Promise<Observable<MergedTrack[]>> {
    const tracksJsonRaw = this.dataAccessService.getCollectionTracksJson();
    const tracksJson =
      tracksJsonRaw && tracksJsonRaw.length ? JSON.parse(tracksJsonRaw) : '';
    if (tracksJson && tracksJson.length) {
      return of(tracksJson);
    }
    const am = await this.retrieveAppleMusicService.getAppleMusicJson();
    return this.makeTrackList(
      this.retrieveDiscogsCollectionService.getCollection(),
      am
    ).pipe(
      tap((result) => {
        Logger.log('Parseed items');
        this.dataAccessService.writeCollectionTracksJson(result);
      })
    );
  }
}
