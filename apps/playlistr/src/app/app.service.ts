import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { MergedTrack, Release } from '@playlistr/shared/types';
import { RetrieveAlbumImageService } from './retrieve-album-image.service';
import { RetrieveDiscogsCollectionService } from './retrieve-discogs-collection.service';
import { RetrieveTrackBpmService } from './retrieve-track-bpm.service';
import { RetrieveMergedTracksService } from './retrieve-merged-tracks.service';
import { RetrieveAppleMusicService } from './retrieve-apple-music.service';

@Injectable()
export class AppService {
  constructor(
    private retrieveAlbumImageService: RetrieveAlbumImageService,
    private discogsCollectionService: RetrieveDiscogsCollectionService,
    private retrieveTrackBpmService: RetrieveTrackBpmService,
    private retrieveMergedTracksService: RetrieveMergedTracksService,
    private retrieveAppleMusicService: RetrieveAppleMusicService
  ) {}

  getCollection(): Observable<Release[]> {
    return this.discogsCollectionService.getCollection();
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

  convertAppleMusic() {
    return this.retrieveAppleMusicService.convertPlaylist();
  }

  getAppleMusicJson() {
    return this.retrieveAppleMusicService.getAppleMusicJson();
  }
}
