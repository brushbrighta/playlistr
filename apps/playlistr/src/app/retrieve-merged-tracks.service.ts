import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { combineLatest, filter, map, Observable, of, tap } from 'rxjs';

import {
  MergedTrack,
  Release,
  ReleaseTrack,
  Video,
} from '@playlistr/shared/types';
import { DataAccessService } from './data.access.service';
import { DiscogsCollectionService } from './discogs-collection.service';
import { RetrieveAppleMusicService } from './retrieve-apple-music.service';
const stringSimilarity = require('string-similarity');

@Injectable()
export class RetrieveMergedTracksService {
  userName = 'nikolaj_bremen';
  constructor(
    private httpService: HttpService,
    private dataAccessService: DataAccessService,
    private retrieveDiscogsCollectionService: DiscogsCollectionService,
    private retrieveAppleMusicService: RetrieveAppleMusicService
  ) {}

  private findVideo(
    artistName: string,
    trackName: string,
    videos: Video[]
  ): Video | null {
    Logger.log('searching video for ', artistName, '-', trackName);
    if (!videos) {
      return null;
    }
    const videoNames = videos.map((v) => v.title);
    const string = trackName;
    const result = stringSimilarity.findBestMatch(string, videoNames);
    const bestMatch =
      result.bestMatch.rating > 0.49 ? videos[result.bestMatchIndex] : null;
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
    const appleMusicNames = tracksApple.map((v) => (v.Artist + ' ' + v.Name).replace(/[^a-zA-Z]/g,'_'));
    const string = (artistName + ' ' + trackName).replace(/[^a-zA-Z]/g,'_');
    const result = stringSimilarity.findBestMatch(string, appleMusicNames);
    const bestMatch =
      result.bestMatch.rating > 0.49 ? tracksApple[result.bestMatchIndex] : null;

    return bestMatch ? bestMatch['Track ID'] : null;
  }

  private extrackTrackFromRelease(
    release: Release,
    tracksApple: any[]
  ): MergedTrack[] {
    return release.tracklist.map((track: ReleaseTrack, index): MergedTrack => {
      return {
        id: release.id + '_' + track.position,
        discogsreleaseId: release.id,
        discogsIndex: index,
        appleMusicTrackId: this.findAppleMusic(
          track.artists && track.artists.length ? track.artists[0].name : release.artists[0].name,
          track.title,
          tracksApple
        ),
        video: this.findVideo(
          release.artists_sort,
          track.title,
          release.videos
        ),
      };
    });
  }
  private makeTrackList(
    releases$: Observable<Release[]>,
    appleMusicTracks$: Observable<any[]>
  ): Observable<MergedTrack[]> {
    return combineLatest([releases$, appleMusicTracks$]).pipe(
      filter(
        ([releases, tracksApple]) =>
          releases.length > 0 && tracksApple.length > 0
      ),
      map(([releases, tracksApple]) => {
        return releases.reduce((prev, curr, currentIndex) => {
          return [...prev, ...this.extrackTrackFromRelease(curr, tracksApple)];
        }, []);
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
        this.dataAccessService.writeCollectionTracksJson(result)
      })
    );
  }
}
