import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AppleMusicFacade } from '@playlistr/fe/apple-music/data-access';
import {
  AppleMusicTrack,
  Dictionary,
  MergedTrack,
} from '@playlistr/shared/types';
import { map, Observable, tap } from 'rxjs';
import { Track } from 'ngx-audio-player/lib/model/track.model';
import { AudioPlayerComponent } from 'ngx-audio-player';
import { MergedTracksApiService } from '@playlistr/fe/tracks/api';
import { DiscogsReleasesApiService } from '@playlistr/fe/collection/api';

@Component({
  selector: 'apple-music-tracks',
  template: `
    <div
      style="position: fixed; bottom: 0; top: 0; left: 0; right: 50%; background: #fff; padding: 1px;"
    >
      <h2>
        Hello tracks ({{ (tracks$ | async).length }})
        <button mat-button (click)="refresh()">Refresh by Apple-XML</button>
      </h2>
      <cdk-virtual-scroll-viewport style="height: 100%" [itemSize]="132">
        <apple-music-single-track
          style="margin-bottom: 10px; display: block"
          *cdkVirtualFor="let track of tracks$ | async"
          [track]="track"
          [tracksByApple]="tracksByApple$ | async"
          (addToPlaylist)="onAddToPlaylist($event)"
          (fetchImage)="fetchImage($event)"
          (playVideo)="playVideo($event)"
        >
        </apple-music-single-track>
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
export class AppleMusicTracksComponent implements OnInit {
  @ViewChild(AudioPlayerComponent, { static: true }) player:
    | AudioPlayerComponent
    | undefined;

  videoId: string | null = null;
  playlist: Track[] = [];

  tracks$: Observable<AppleMusicTrack[]> =
    this.appleMusicFacade.allAppleMusicTracks$;

  tracksByApple$: Observable<Dictionary<MergedTrack>> =
    this.mergedTracksApiService.mergedTracksByAppleId$;

  constructor(
    private appleMusicFacade: AppleMusicFacade,
    private mergedTracksApiService: MergedTracksApiService,
    private discogsReleasesApiService: DiscogsReleasesApiService
  ) {}

  ngOnInit() {
    this.tracksByApple$
      .pipe(
        map((dict: Dictionary<MergedTrack>) =>
          Object.keys(dict)
            .map((key): number => parseInt(key, 10))
            .map((key) => dict[key])
        )
      )
      .subscribe((list) =>
        console.log('count with video', list.filter((l) => !!l.video).length)
      );
  }

  onAddToPlaylist(newFile: Track) {
    if (this.player) {
      // const o = this.player.currentTime || 0;
      try {
        this.player.resetSong();
      } catch (e) {
        console.log(e);
      }

      this.playlist = [...this.playlist, newFile];
      this.player.selectTrack(this.playlist.length);
      this.player.play();
      // console.log('offset should be', o);
      // this.player.startOffset = o;
      // this.player.updateCurrentTrack();
    }
  }

  fetchImage(discogsReleaseId: number) {
    if (discogsReleaseId) {
      this.discogsReleasesApiService.fetchImage(discogsReleaseId);
    }
  }

  refresh() {
    this.appleMusicFacade.refresh();
  }

  playVideo(videoUrl: string) {
    console.log('playVideo', videoUrl);
    this.videoId = videoUrl;
  }
}
