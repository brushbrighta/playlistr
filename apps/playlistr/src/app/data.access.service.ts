import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DataAccessService {
  private CollectionMetaJsonName = 'collection-meta.json';
  private CollectionReleasesJsonName = 'collection-releases.json';
  private CollectionTracksJsonName = 'collection-tracks.json';
  private AppleMusicJsonName = 'apple-music.json';

  private getJson(fileName) {
    return readFileSync(join(process.cwd(), 'data', fileName), 'utf8');
  }

  private writeJson(data, fileName) {
    writeFileSync(
      join(process.cwd(), 'data', fileName),
      JSON.stringify(data, null, 4)
    );
  }

  // meta
  public getMetaJson() {
    return this.getJson(this.CollectionMetaJsonName);
  }
  public writeMetaJson(data) {
    this.writeJson(data, this.CollectionMetaJsonName);
  }
  // releases
  public getCollectionReleasesJson() {
    return this.getJson(this.CollectionReleasesJsonName);
  }
  public writeCollectionReleasesJson(data) {
    this.writeJson(data, this.CollectionReleasesJsonName);
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
    const fileName = 'Vinyl.xml';
    return join(process.cwd(), 'data', fileName);
  }

  public getAppleMusicJson(): string {
    return this.getJson(this.AppleMusicJsonName);
  }

  public writetAppleMusicJson(data) {
    return this.writeJson(data, this.AppleMusicJsonName);
  }
}
