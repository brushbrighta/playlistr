import { Injectable, Logger } from '@nestjs/common';
import { DataAccessService } from './data.access.service';
import {
  firstValueFrom,
  fromEvent,
  last,
  merge,
  Observable,
  of,
  reduce,
  share,
  Subject,
  switchMap,
  take,
  takeLast,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { AppleMusicTrack } from '@playlistr/shared/types';

const fs = require('fs'),
  itunes = require('itunes-data');

@Injectable()
export class RetrieveAppleMusicService {
  constructor(private dataAccessService: DataAccessService) {}

  convertPlaylist(): Observable<AppleMusicTrack[]> {
    const parser = itunes.parser();
    const stream = fs.createReadStream(
      this.dataAccessService.getAppleMusicXMLLocation()
    );
    stream.pipe(parser);
    Logger.log('Starting convertPlaylist');

    stream.pause();

    const finishEventName = 'close';
    const dataEventName = 'track';

    return new Observable((subscriber) => {
      const complete$ = fromEvent(parser, finishEventName).pipe(take(1));

      complete$.subscribe((e) => subscriber.complete());

      fromEvent(parser, dataEventName)
        .pipe(takeUntil(complete$))
        .subscribe((data) => {
          subscriber.next(data);
        });

      fromEvent(parser, 'error')
        .pipe(
          takeUntil(complete$),
          switchMap((e) => throwError(() => (e) => of(e)))
        )
        .subscribe((e) => subscriber.error(e));
      // Start the underlying node stream
      stream.resume();
    }).pipe(
      reduce((prev, curr) => [...prev, curr], []),
      last(),
      tap((data) => {
        this.dataAccessService.writetAppleMusicJson(data);
        Logger.log(`Wrote ${data.length} entries`);
      })
    );
  }

  private getCollectionData(): AppleMusicTrack[] | null {
    const collectionJsonRaw = this.dataAccessService.getAppleMusicJson();
    const collectionJson =
      collectionJsonRaw && collectionJsonRaw.length
        ? JSON.parse(collectionJsonRaw)
        : null;
    return collectionJson;
  }

  getAppleMusicJson(): Observable<AppleMusicTrack[]> {
    const appleMusicJson = this.getCollectionData();

    if (appleMusicJson && appleMusicJson.length) {
      Logger.log(`Caached collection is ${appleMusicJson.length}`);
      return of(appleMusicJson);
    }
    return this.convertPlaylist();
    // const json = this.convertPlaylist();
    // return of(json);
  }
}
