import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AppleMusicTrack,
  Dictionary,
  MergedTrack,
} from '@playlistr/shared/types';
import { Track } from 'ngx-audio-player/lib/model/track.model';

@Component({
  selector: 'apple-music-single-track',
  template: `
    <mat-card style="position: relative">
      <div
        *ngIf="tracksByApple[track['Track ID']]"
        [style.backgroundImage]="
          'url(images/' +
          tracksByApple[track['Track ID']].discogsreleaseId +
          '.png)'
        "
        style="opacity: .5; filter: blur(.5rem); position: absolute; top: 0; bottom: 0; right: 0; left: 0; background-repeat: no-repeat;
        background-position: center center;
  background-size: cover;"
      ></div>
      <mat-card-header style="position: relative">
        <img
          *ngIf="tracksByApple[track['Track ID']]"
          mat-card-avatar
          [src]="
            'images/' +
            tracksByApple[track['Track ID']].discogsreleaseId +
            '.png'
          "
          (error)="
            fetchImage.emit(tracksByApple[track['Track ID']].discogsreleaseId)
          "
        />
        <mat-icon *ngIf="!tracksByApple[track['Track ID']]" mat-card-avatar
          >music_note</mat-icon
        >
        <mat-card-title>{{ track.Name }}</mat-card-title>
        <mat-card-subtitle>{{ track.Artist }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-actions style="position: relative">
        <ng-container *ngIf="hasFile(track)">
          <button mat-icon-button (click)="onAddToPlaylist(track)">
            <mat-icon>playlist_add</mat-icon>
          </button>
        </ng-container>
        <ng-container
          *ngIf="
            tracksByApple[track['Track ID']] &&
            !!tracksByApple[track['Track ID']].video
          "
        >
          <button mat-icon-button>
            <mat-icon>video</mat-icon>
          </button>
        </ng-container>
      </mat-card-actions>
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
export class AppleMusicSingleTrackComponent {
  @Input() track: AppleMusicTrack | undefined;
  @Input() tracksByApple: Dictionary<MergedTrack> = {};
  @Output() addToPlaylist: EventEmitter<Track> = new EventEmitter<Track>();
  @Output() fetchImage: EventEmitter<number> = new EventEmitter<number>();

  onAddToPlaylist(track: AppleMusicTrack) {
    const p = this.replacePath(track.Location);
    if (p) {
      this.addToPlaylist.emit({
        title: track.Name,
        artist: track.Artist,
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

  hasFile(track: AppleMusicTrack): boolean {
    return !!(
      track.Location &&
      (track.Location.slice(-3) === 'mp3' || track.Location.slice(-3) === 'm4a')
    );
  }
}
