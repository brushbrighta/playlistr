import {
  ChangeDetectionStrategy,
  Component,
  Input,
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
      style="position: fixed; bottom: 0; top: 0; left: 0; right: 50%; background: #fff; padding: 1px;"
    >
      <div style="margin-bottom: 3px;">
        <ng-content></ng-content>
      </div>
      <cdk-virtual-scroll-viewport
        class="styled-scrollbars"
        style="height: 100%"
        [itemSize]="132"
      >
        <plstr-single-track-ui
          style="margin-bottom: 10px; display: block"
          *cdkVirtualFor="let track of tracks"
          [track]="track"
          (addToPlaylist)="onAddToPlaylist($event)"
          (fetchImage)="fetchImage($event)"
          (playVideo)="playVideo($event)"
        >
        </plstr-single-track-ui>
      </cdk-virtual-scroll-viewport>
    </div>
    <div
      style="position: fixed; bottom: 0; top: 0; right: 0; left: 50%; background: #fff; padding: 1px;"
    >
      <ngx-audio-player
        [playlist]="playlist"
        [displayArtist]="true"
      ></ngx-audio-player>
      <hr />
      <pl-yt-player [videoId]="videoId"></pl-yt-player>
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

  @Input() tracks: ConductedTrack[] = [];

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

  fetchImage(discogsReleaseId: number) {
    if (discogsReleaseId) {
      console.log('image error, implement later');
    }
  }

  playVideo(videoUrl: string) {
    console.log('playVideo', videoUrl);
    this.videoId = videoUrl;
  }
}
