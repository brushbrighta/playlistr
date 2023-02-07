import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Track } from 'ngx-audio-player/lib/model/track.model';
import { ConductedTrack } from '@playlistr/fe/data-conductor';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'plstr-simple-track-ui',
  standalone: true,
  template: `
    <div class="w-full relative @container/item">
      <div class="bg-gray-800 shadow-lg rounded p-3 flex">
        <div
          class="group relative w-12 h-12 @md/item:w-32 @md/item:h-32 shrink-0"
        >
          <img
            *ngIf="track.discogsRelease"
            class="w-full block rounded"
            (error)="fetchImage.emit(track.discogsRelease.id)"
            [attr.src]="'images/' + track.discogsRelease.id + '.png'"
            alt=""
          />
          <img
            *ngIf="!track.discogsRelease"
            class="w-full h-full block rounded"
            [attr.src]="'assets/unknown_album.jpeg'"
            alt=""
          />
          <div
            class="absolute bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex items-center group-hover:opacity-100 transition justify-evenly"
          >
            <button
              *ngIf="!minimal"
              (click)="
                playVideo.emit(
                  track.video?.uri.replace(
                    'https://www.youtube.com/watch?v=',
                    ''
                  )
                );
                currentlyPlaying.emit(track)
              "
              class="hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                class="bi bi-play-circle-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="px-2 @md/item:p-5">
          <div class="">
            <h3 class="text-white text-md @md/item:text-lg ">
              {{ track.title }}
            </h3>
            <p class="text-gray-400">
              {{ track.artist }}
            </p>
          </div>
        </div>
      </div>
      <div class="absolute top-1/2 right-4 transform -translate-y-1/2">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [``],
  imports: [CommonModule, MatIconModule],
})
export class SimpleTrackItem {
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
