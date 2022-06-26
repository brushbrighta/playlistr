import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, Observable, of, tap } from 'rxjs';

import {
  MergedTrack,
  Release,
  ReleaseTrack,
  Video,
} from '@playlistr/shared/types';
import { DataAccessService } from './data.access.service';
import { RetrieveDiscogsCollectionService } from './retrieve-discogs-collection.service';
const stringSimilarity = require('string-similarity');

@Injectable()
export class RetrieveMergedTracksService {
  userName = 'nikolaj_bremen';
  constructor(
    private httpService: HttpService,
    private dataAccessService: DataAccessService,
    private retrieveDiscogsCollectionService: RetrieveDiscogsCollectionService
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
      result.bestMatch.rating > 0.6 ? videos[result.bestMatchIndex] : null;
    Logger.log(`found match: ${bestMatch !== null}`);

    return bestMatch;
  }

  private extrackTrackFromRelease(release: Release): MergedTrack[] {
    return release.tracklist.map(
      (track: ReleaseTrack, index): MergedTrack => ({
        id: release.id + '_' + track.position,
        discogsreleaseId: release.id,
        discogsIndex: index,
        video: this.findVideo(
          release.artists[0].name,
          track.title,
          release.videos
        ),
      })
    );
  }
  private makeTrackList(
    releases$: Observable<Release[]>
  ): Observable<MergedTrack[]> {
    return releases$.pipe(
      map((releases: Release[]) => {
        return releases.reduce((prev, curr, currentIndex) => {
          return [...prev, ...this.extrackTrackFromRelease(curr)];
        }, []);
      })
    );
  }

  getTracks(): Observable<MergedTrack[]> {
    const tracksJsonRaw = this.dataAccessService.getCollectionTracksJson();
    const tracksJson =
      tracksJsonRaw && tracksJsonRaw.length ? JSON.parse(tracksJsonRaw) : '';
    if (tracksJson && tracksJson.length) {
      return of(tracksJson);
    }
    return this.makeTrackList(
      this.retrieveDiscogsCollectionService.getCollection()
    ).pipe(
      tap((result) => this.dataAccessService.writeCollectionTracksJson(result))
    );
  }
}
