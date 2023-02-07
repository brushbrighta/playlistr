import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Track } from 'ngx-audio-player/lib/model/track.model';
import { AudioPlayerComponent, NgxAudioPlayerModule } from 'ngx-audio-player';
import {
  ConductedTrack,
  FeDataConductorModule,
} from '@playlistr/fe/data-conductor';
import { CommonModule } from '@angular/common';
import {
  ConductedTrackItemModule,
  YoutubeUiModule,
} from '@playlistr/fe/typed-ui';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularSplitModule } from 'angular-split';
import { SimpleTrackItem } from '../simple-track-item/simple-track-item.component';

@Component({
  selector: 'plstr-tracklist-ui',
  standalone: true,
  imports: [
    CommonModule,
    ConductedTrackItemModule,
    FeDataConductorModule,
    YoutubeUiModule,
    ScrollingModule,
    NgxAudioPlayerModule,
    MatIconModule,
    MatButtonModule,
    AngularSplitModule,
    SimpleTrackItem,
  ],
  template: `
    <div
      *ngIf="tracks"
      style="position: fixed; bottom: 0; top: 0; left: 0; right: 0;"
    >
      <as-split
        direction="horizontal"
        [gutterSize]="24"
        (dragStart)="onDragStart()"
        (dragEnd)="onDragEnd()"
      >
        <as-split-area [size]="40">
          <div style="margin-bottom: 3px;" #headerHere>
            <ng-content></ng-content>
          </div>
          <cdk-virtual-scroll-viewport
            class="styled-scrollbars"
            style="height: calc(100% - {{
              headerHere.getBoundingClientRect().height + 3
            }}px)"
            [itemSize]="72"
          >
            <section class="p-3">
              <plstr-simple-track-ui
                class="mb-3 block"
                *cdkVirtualFor="let track of tracks"
                [track]="track"
                (addToPlaylist)="onAddToPlaylist($event)"
                (fetchImage)="onFetchImage($event)"
                (playVideo)="playVideo($event)"
                (currentlyPlaying)="currentlyPlaying = $event"
                (refreshRelease)="onRefreshRelease($event)"
              ></plstr-simple-track-ui>
            </section>
          </cdk-virtual-scroll-viewport>
        </as-split-area>
        <as-split-area [size]="60" class="relative">
          <div class="flex flex-col h-screen overflow-hidden">
            <div class="flex-grow flex items-stretch">
              <pl-yt-player
                class="flex-grow flex items-stretch"
                [videoId]="videoId"
                (stopped)="playNextVideo()"
              ></pl-yt-player>
            </div>
            <div style="height: 150px">
              <plstr-simple-track-ui
                *ngIf="currentlyPlaying || videoId"
                [track]="currentlyPlaying"
                [minimal]="true"
              >
                <button
                  mat-icon-button
                  (click)="playNextVideo()"
                  class="text-gray-100"
                >
                  <mat-icon>skip_next</mat-icon>
                </button>
              </plstr-simple-track-ui>
            </div>
          </div>
        </as-split-area>
      </as-split>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TracklistComponent implements OnInit {
  @ViewChild(AudioPlayerComponent, { static: true }) player:
    | AudioPlayerComponent
    | undefined;

  _videoId: string | null = null;
  videoId: string | null = null;
  playlist: Track[] = [];
  currentlyPlaying: ConductedTrack | null = null;

  @Input() minimalUi = false;
  @Input() tracks: ConductedTrack[] = [];
  @Output() refreshRelease: EventEmitter<number> = new EventEmitter<number>();
  @Output() fetchImage: EventEmitter<number> = new EventEmitter<number>();

  onAddToPlaylist(newFile: Track) {
    if (this.player) {
      if (this.player.isPlaying) {
        this.player.resetSong();
      }
      this.playlist = [...this.playlist, newFile];
      this.player.selectTrack(this.playlist.length);
      this.player.play();
    }
  }

  onFetchImage(discogsReleaseId: number) {
    if (discogsReleaseId) {
      this.fetchImage.emit(discogsReleaseId);
    }
  }

  onRefreshRelease(discogsReleaseId: number) {
    if (discogsReleaseId) {
      this.refreshRelease.emit(discogsReleaseId);
    }
  }

  playVideo(videoId: string) {
    this.videoId = videoId;
  }

  playNextVideo() {
    const tracksWithVideo = this.tracks.filter((t) => !!t.video);
    const randomIndex = Math.floor(Math.random() * tracksWithVideo.length);
    const selected = tracksWithVideo[randomIndex].video?.uri;
    const videoId = selected?.replace('https://www.youtube.com/watch?v=', '');
    if (videoId) {
      this.currentlyPlaying = tracksWithVideo[randomIndex];
      this.videoId = videoId;
    }
  }

  onDragStart() {
    this._videoId = this.videoId;
    this.videoId = null;
  }

  onDragEnd() {
    this.videoId = this._videoId;
    this._videoId = null;
  }

  ngOnInit() {}
}
