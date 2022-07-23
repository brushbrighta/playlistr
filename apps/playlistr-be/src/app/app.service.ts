import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AppleMusicTrack, MergedTrack, Release } from '@playlistr/shared/types';
import { DiscogsCollectionService } from './discogs/discogs-collection.service';
import { RetrieveTrackBpmService } from './retrieve-track-bpm.service';
import {AlbumImageService} from "./album-image/album-image.service";
import {MergedTracksService} from "./merged-tracks.service";
import {AppleMusicService} from "./apple-music/apple-music.service";

@Injectable()
export class AppService {
  constructor(
    private retrieveAlbumImageService: AlbumImageService,
    private discogsCollectionService: DiscogsCollectionService,
    private retrieveTrackBpmService: RetrieveTrackBpmService,
    private retrieveMergedTracksService: MergedTracksService,
    private retrieveAppleMusicService: AppleMusicService
  ) {}

  getCollection(): Observable<Release[]> {
    return this.discogsCollectionService.getCollection();
  }

  updateRelease(id: number) {
    return this.discogsCollectionService.updateRelease(id);
  }

  getTracks(): Promise<Observable<MergedTrack[]>> {
    return this.retrieveMergedTracksService.getTracks();
  }

  addImage(releaseId: string) {
    return this.retrieveAlbumImageService.addImage(releaseId);
  }

  retrieveBpm(trackId: string): Promise<string> {
    return this.retrieveTrackBpmService.retrieveBpm(trackId);
  }

  convertAppleMusic(): Observable<AppleMusicTrack[]> {
    return this.retrieveAppleMusicService.convertPlaylist();
  }

  getAppleMusicJson(): Observable<AppleMusicTrack[]> {
    return this.retrieveAppleMusicService.getAppleMusicJson();
  }
}
