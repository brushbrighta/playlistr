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
        style="opacity: .4; filter: blur(.5rem); position: absolute; top: 0; bottom: 0; right: 0; left: 0; background-repeat: no-repeat;
        background-position: center center;
  background-size: cover;"
      ></div>
      <mat-card-header style="position: relative">
        <img
          *ngIf="track.discogsRelease"
          mat-card-avatar
          [src]="'images/' + track.discogsRelease.id + '.png'"
          (error)="fetchImage.emit(track.discogsRelease.id)"
        />
        <mat-icon *ngIf="!track.discogsRelease" mat-card-avatar
          >music_note</mat-icon
        >
        <mat-card-title>{{ track.title }}</mat-card-title>
        <mat-card-subtitle
          >{{ track.artist }} | {{ track.album }}</mat-card-subtitle
        >
      </mat-card-header>

      <mat-card-content style="position: relative">
        <!--        <pre>{{ track.appleMusicTrack | json }}</pre>-->
      </mat-card-content>

      <mat-toolbar-row style="position: relative">
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
          (plaVideo)="playVideo.emit($event)"
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
  @Input() track: ConductedTrack | undefined;
  @Output() addToPlaylist: EventEmitter<Track> = new EventEmitter<Track>();
  @Output() fetchImage: EventEmitter<number> = new EventEmitter<number>();
  @Output() playVideo: EventEmitter<string> = new EventEmitter<string>();

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
