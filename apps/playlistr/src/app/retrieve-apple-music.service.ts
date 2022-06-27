import { Injectable, Logger } from '@nestjs/common';
import { DataAccessService } from './data.access.service';
import { firstValueFrom, Observable, of, Subject } from 'rxjs';
import { AppleMusicTrack } from '@playlistr/shared/types';

const fs = require('fs'),
  itunes = require('itunes-data');

@Injectable()
export class RetrieveAppleMusicService {
  constructor(private dataAccessService: DataAccessService) {}

  async convertPlaylist(): Promise<AppleMusicTrack[]> {
    const parser = itunes.parser();
    const stream = fs.createReadStream(
      this.dataAccessService.getAppleMusicXMLLocation()
    );
    const tracks: AppleMusicTrack[] = [];
    parser.on('track', function (track) {
      tracks.push(track);
    });
    stream.pipe(parser);
    const closeSubject$ = new Subject<void>();
    stream.on('close', () => {
      closeSubject$.next();
    });
    await firstValueFrom(closeSubject$);
    this.dataAccessService.writetAppleMusicJson(tracks);
    return tracks;
  }

  private getCollectionData(): AppleMusicTrack[] | null {
    const collectionJsonRaw = this.dataAccessService.getAppleMusicJson();
    const collectionJson =
      collectionJsonRaw && collectionJsonRaw.length
        ? JSON.parse(collectionJsonRaw)
        : null;
    return collectionJson;
  }

  async getAppleMusicJson(): Promise<Observable<AppleMusicTrack[]>> {
    const appleMusicJson = this.getCollectionData();

    if (appleMusicJson && appleMusicJson.length) {
      return of(appleMusicJson);
    }
    const json = await this.convertPlaylist();
    return of(json);
  }
}
