import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Track } from 'ngx-audio-player/lib/model/track.model';
import { ConductedTrack } from '@playlistr/fe/data-conductor';

@Component({
  selector: 'plstr-single-track-ui',
  template: `
    <mat-card style="position: relative">
      <div
        *ngIf="track.discogsRelease"
        [style.backgroundImage]="
          'url(images/' + track.discogsRelease.id + '.png)'
        "
        style="opacity: .4; position: absolute; top: 0; bottom: 0; right: 0; left: 0; background-repeat: no-repeat;
        background-position: center center;
  background-size: cover;"
      >
        <!-- filter: blur(.2rem); -->
      </div>
      <div
        style="background: linear-gradient(80deg, rgba(66,66,66,1) 50%, rgba(66,66,66, 0) );  position: absolute; top: 0; bottom: 0; right: 0; left: 0; "
      ></div>
      <mat-card-header style="position: relative">
        <img
          *ngIf="track.discogsRelease"
          mat-card-avatar
          [src]="'images/' + track.discogsRelease.id + '.png'"
          (error)="fetchImage.emit(track.discogsRelease.id)"
        />
        <mat-icon *ngIf="!track.discogsRelease" mat-card-avatar
          >music_note
        </mat-icon>
        <mat-card-title>{{ track.title }}</mat-card-title>
        <mat-card-subtitle
          >{{ track.artist }} | {{ track.album }}</mat-card-subtitle
        >
      </mat-card-header>

      <mat-card-content style="position: relative" *ngIf="!minimal">
        <plstr-tags
          type="GENRE"
          [tagString]="track.appleMusicTrack.Genre"
        ></plstr-tags>
        <plstr-tags
          type="ENERGY"
          [tagString]="track.appleMusicTrack.Comments"
        ></plstr-tags>
        <plstr-tags
          type="MOOD"
          [tagString]="track.appleMusicTrack.Comments"
        ></plstr-tags>
        <plstr-tags
          type="FAV"
          [tagString]="track.appleMusicTrack.Loved"
        ></plstr-tags>
      </mat-card-content>

      <mat-toolbar-row style="position: relative" *ngIf="!minimal">
        <button
          mat-icon-button
          (click)="onAddToPlaylist(track)"
          [disabled]="!hasFile(track)"
        >
          <mat-icon>playlist_add</mat-icon>
        </button>
        <a
          mat-icon-button
          target="_blank"
          [disabled]="!!track.discogsRelease"
          href="https://www.discogs.com/search?q={{ track.artist }}+{{
            track.album
          }}&type=all"
        >
          <mat-icon>search</mat-icon>
        </a>
        <a
          mat-icon-button
          target="_blank"
          (click)="onRefreshRelease(track.discogsRelease.id)"
          [disabled]="!track.discogsRelease"
          href="{{ track.discogsRelease?.uri }}"
        >
          <img
            style="width: 24px; height: 24px; position: relative; top: -1px;"
            src="assets/discogs.svg"
          />
        </a>
        <plstr-release-video
          [video]="track.video"
          (plaVideo)="playVideo.emit($event); currentlyPlaying.emit(track)"
        ></plstr-release-video>
      </mat-toolbar-row>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      mat-icon.mat-card-avatar {
        width: 40px;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        text-align: center;
        background: #333;
      }
    `,
  ],
})
export class ConductedTrackItem {
  @Input() minimal = false;
  @Input() track: ConductedTrack | undefined;
  @Output() addToPlaylist: EventEmitter<Track> = new EventEmitter<Track>();
  @Output() fetchImage: EventEmitter<number> = new EventEmitter<number>();
  @Output() playVideo: EventEmitter<string> = new EventEmitter<string>();
  @Output() currentlyPlaying: EventEmitter<ConductedTrack> =
    new EventEmitter<ConductedTrack>();
  @Output() refreshRelease: EventEmitter<number> = new EventEmitter<number>();

  onAddToPlaylist(track: ConductedTrack) {
    const p = this.replacePath(track.appleMusicTrack.Location);
    if (p) {
      this.addToPlaylist.emit({
        title: track.title,
        artist: track.artist,
        link: p,
      });
    }
  }

  onRefreshRelease(id: number) {
    this.refreshRelease.emit(id);
  }

  private replacePath(location: string | undefined): string | null {
    if (!location) {
      return null;
    }
    const fileprefix =
      'file:///Users/nsokolowski/Documents/musik/_apple-music/Music';
    if (location.includes(fileprefix)) {
      return location.replace(fileprefix, 'http://127.0.0.1:8080');
    } else {
      console.log('unconsidered path', location);
      return null;
    }
  }

  hasFile(track: ConductedTrack): boolean {
    return !!(
      track.appleMusicTrack.Location &&
      (track.appleMusicTrack.Location.slice(-3) === 'mp3' ||
        track.appleMusicTrack.Location.slice(-3) === 'm4a')
    );
  }
}
