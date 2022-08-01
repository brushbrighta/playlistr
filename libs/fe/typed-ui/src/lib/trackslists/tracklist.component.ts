import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Track } from 'ngx-audio-player/lib/model/track.model';
import { AudioPlayerComponent } from 'ngx-audio-player';
import { ConductedTrack } from '@playlistr/fe/data-conductor';

@Component({
  selector: 'plstr-tracklist-ui',
  template: `
    <div
      *ngIf="tracks"
      style="position: fixed; bottom: 0; top: 0; left: 0; right: 50%; padding: 1px;"
    >
      <div style="margin-bottom: 3px;">
        <ng-content></ng-content>
      </div>
      <cdk-virtual-scroll-viewport
        class="styled-scrollbars"
        style="height: calc(100% - 150px)"
        [itemSize]="190.5"
      >
        <plstr-single-track-ui
          style="margin-bottom: 10px; display: block"
          *cdkVirtualFor="let track of tracks"
          [track]="track"
          (addToPlaylist)="onAddToPlaylist($event)"
          (fetchImage)="onFetchImage($event)"
          (playVideo)="playVideo($event)"
          (currentlyPlaying)="currentlyPlaying = $event"
          (refreshRelease)="onRefreshRelease($event)"
        >
        </plstr-single-track-ui>
      </cdk-virtual-scroll-viewport>
    </div>
    <div
      style="position: fixed; bottom: 0; top: 0; right: 0; left: 50%;  padding: 1px;"
    >
      <ngx-audio-player
        *ngIf="!minimalUi"
        [playlist]="playlist"
        [displayArtist]="true"
      ></ngx-audio-player>
      <pl-yt-player
        [videoId]="videoId"
        (stopped)="playNextVideo()"
      ></pl-yt-player>
      <plstr-single-track-ui
        *ngIf="currentlyPlaying"
        [track]="currentlyPlaying"
        [minimal]="true"
      >
      </plstr-single-track-ui>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TracklistComponent {
  @ViewChild(AudioPlayerComponent, { static: true }) player:
    | AudioPlayerComponent
    | undefined;

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
}
