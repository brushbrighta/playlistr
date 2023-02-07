import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
  tap,
  timer,
} from 'rxjs';

import { CollectionMeta, Release } from '@playlistr/shared/types';
import { DataAccessService } from '../data-access/data.access.service';

@Injectable()
export class DiscogsCollectionService {
  userName = 'nikolaj_bremen';

  constructor(
    private httpService: HttpService,
    private dataAccessService: DataAccessService
  ) {}

  private getCollectionData(): Release[] | null {
    const collectionJsonRaw =
      this.dataAccessService.getCollectionReleasesJson();
    const collectionJson =
      collectionJsonRaw && collectionJsonRaw.length
        ? JSON.parse(collectionJsonRaw)
        : null;
    return collectionJson;
  }

  updateRelease(releaesId: number): Observable<Release> {
    const collectionJson: Release[] = this.getCollectionData() || [];
    const release = collectionJson.find((r) => r.id === releaesId);

    const request = this.httpService
      .get(release.resource_url)
      .pipe(map((response) => response.data));

    return request.pipe(
      tap((release) => {
        this.dataAccessService.writeCollectionReleasesJson(
          this.dataAccessService.updateInCollection(collectionJson, release)
        );
      })
    );
  }

  getCollection(): Observable<Release[]> {
    const collectionJson = this.getCollectionData();

    const url =
      'https://api.discogs.com/users/' +
      this.userName +
      '/collection/folders/0/releases?per_page=500';

    const metaJsonRaw = this.dataAccessService.getMetaJson();
    const metaJson =
      metaJsonRaw && metaJsonRaw.length ? JSON.parse(metaJsonRaw) : '';

    const meta$: Observable<CollectionMeta[]> = this.httpService.get(url).pipe(
      map((response) =>
        response.data.releases.map((s, index) => {
          return {
            id: s.id,
            url: s.basic_information.resource_url,
            date_added: s.date_added,
          };
        })
      ),
      map((currentlyRetrieved) => {
        this.dataAccessService.writeMetaJson(
          this.dataAccessService.mergeMetaJsons(currentlyRetrieved, metaJson)
        );
        const updatedMetaJson = this.dataAccessService.getMetaJson();
        return updatedMetaJson && updatedMetaJson.length
          ? JSON.parse(updatedMetaJson)
          : [];
      })
    );
    return meta$.pipe(
      switchMap((meta: CollectionMeta[]) => {
        const filteredMeta: CollectionMeta[] = meta.filter(
          (entry) =>
            collectionJson.findIndex((existing) => existing.id === entry.id) ===
            -1
        );

        if (filteredMeta.length === 0) {
          return of(collectionJson);
        }

        Logger.log('Add missing items to releases', filteredMeta.length);
        const requests = filteredMeta.map((meta: CollectionMeta, index) => {
          return timer(Math.floor(index / 10) * 60000).pipe(
            tap((_) => Logger.log('fetching ', meta.url)),
            switchMap((_) =>
              this.httpService
                .get(meta.url)
                .pipe(map((response) => response.data))
            )
          );
        });
        return combineLatest(requests).pipe(
          tap((res) =>
            this.dataAccessService.writeCollectionReleasesJson(
              this.dataAccessService.mergeCollectionJsons(res, collectionJson)
            )
          )
        );
      })
    );
  }
}
