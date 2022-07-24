import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { CollectionMeta, Release } from '@playlistr/shared/types';

@Injectable()
export class DataAccessService {
  private CollectionMetaJsonName = 'collection-meta.json';
  private CollectionReleasesJsonName = 'collection-releases.json';
  private CollectionTracksJsonName = 'collection-tracks.json';
  private AppleMusicJsonName = 'apple-music.json';

  private getJson(fileName) {
    try {
      return (
        readFileSync(join(process.cwd(), 'data', fileName), 'utf8') || null
      );
    } catch (err) {
      return null;
    }
  }

  private writeJson(data, fileName) {
    writeFileSync(
      join(process.cwd(), 'data', fileName),
      JSON.stringify(data, null, 4),
      {
        flag: 'w',
      }
    );
  }

  // meta
  public getMetaJson() {
    return this.getJson(this.CollectionMetaJsonName);
  }
  public writeMetaJson(data) {
    this.writeJson(data, this.CollectionMetaJsonName);
  }
  public mergeMetaJsons(
    currentlyRetrieved: CollectionMeta[],
    metaJson: CollectionMeta[]
  ): CollectionMeta[] {
    if (!metaJson || !metaJson.length) {
      Logger.log(
        'Blanc file. Number of items added',
        currentlyRetrieved.length
      );
      return currentlyRetrieved;
    }
    const filteredRetrieved = currentlyRetrieved.filter(
      (entry) =>
        metaJson.findIndex((existing) => existing.id === entry.id) === -1
    );
    if (filteredRetrieved.length) {
      Logger.log('Number of items added', filteredRetrieved.length);
      filteredRetrieved.forEach((item) => Logger.log(item));
    } else {
      Logger.log('No new Items added');
    }
    return [...metaJson, ...filteredRetrieved];
  }
  // releases
  public getCollectionReleasesJson() {
    return this.getJson(this.CollectionReleasesJsonName);
  }
  public writeCollectionReleasesJson(data) {
    this.writeJson(data, this.CollectionReleasesJsonName);
  }
  public mergeCollectionJsons(
    currentlyRetrieved: Release[],
    releaseJson: Release[]
  ): Release[] {
    if (!releaseJson || !releaseJson.length) {
      Logger.log(
        'mergeCollectionJsons: Blanc file. Number of items added',
        currentlyRetrieved.length
      );
      return currentlyRetrieved;
    }
    const filteredRetrieved = currentlyRetrieved.filter(
      (entry) =>
        releaseJson.findIndex((existing) => existing.id === entry.id) === -1
    );
    if (filteredRetrieved.length) {
      Logger.log(
        'mergeCollectionJsons: Number of items added',
        filteredRetrieved.length
      );
      filteredRetrieved.forEach((item) => Logger.log(item));
    } else {
      Logger.log('mergeCollectionJsons: No new Items added');
    }
    return [...releaseJson, ...filteredRetrieved];
  }

  public updateInCollection(releaseJson: Release[], newRelease): Release[] {
    const index = releaseJson.findIndex((r) => r.id === newRelease.id);
    if (index > -1) {
      releaseJson[index] = newRelease;
    }
    return releaseJson;
  }

  // tracks
  public getCollectionTracksJson() {
    return this.getJson(this.CollectionTracksJsonName);
  }
  public writeCollectionTracksJson(data) {
    this.writeJson(data, this.CollectionTracksJsonName);
  }
  // apple-music
  public getAppleMusicXMLLocation(): string {
    const fileName = 'AAA.xml';
    return join(process.cwd(), 'data', fileName);
  }

  public getAppleMusicJson(): string {
    return this.getJson(this.AppleMusicJsonName);
  }

  public writetAppleMusicJson(data) {
    return this.writeJson(data, this.AppleMusicJsonName);
  }
}
