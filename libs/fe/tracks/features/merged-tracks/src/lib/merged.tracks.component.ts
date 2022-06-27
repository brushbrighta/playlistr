import { Component, OnInit } from '@angular/core';
import {
  AppleMusicTrack,
  Dictionary,
  MergedTrack,
  Release,
} from '@playlistr/shared/types';
import { MergedTrackFacade } from '@playlistr/fe/tracks/data-access';
import { AppleMusicApiService } from '@playlistr/fe/apple-music/api';
import { DiscogsReleasesApiService } from '@playlistr/fe/collection/api';

@Component({
  selector: 'pl-merged-tracks',
  template: `
    <h1>Found {{ tracks.length }} tracks with videos in collection</h1>
    <div style="position: fixed; bottom: 0; width: 100%; ">
      <pl-yt-player [videoId]="videoId"></pl-yt-player>
    </div>
    <div *ngFor="let track of tracks" style="clear: both">
      <div style="float: left; margin: 0 20px 20px 0">
        <img
          style="width:60px; height: auto"
          [src]="'http://localhost:3333/' + track.discogsreleaseId + '.png'"
        />
      </div>
      <h3>
        {{
          releases[track.discogsreleaseId] &&
          releases[track.discogsreleaseId].artists
            ? releases[track.discogsreleaseId].artists[0]?.name
            : ''
        }}
        - {{ findTitle(releases[track.discogsreleaseId], track) }}
      </h3>
      <div *ngIf="findAppleMusic(track.appleMusicTrackId) as details">
        <h1 *ngIf="details.Loved === ''" style="color: red; float: right">
          ❤️
        </h1>
        <div>Genre: {{ details.Genre }}</div>
        <div>Meta: {{ details.Comments }}</div>
      </div>
      <plstr-release-video
        (plaVideo)="videoId = $event"
        [video]="track.video"
      ></plstr-release-video>
    </div>
  `,
})
export class MergedTracksComponent implements OnInit {
  tracks: MergedTrack[] = [];
  releases: Dictionary<Release> = {};
  apple: Dictionary<AppleMusicTrack> = {};
  videoId: string | null = null;

  constructor(
    private mergedTrackFacade: MergedTrackFacade,
    private appleMusicApiService: AppleMusicApiService,
    private discogsReleasesApiService: DiscogsReleasesApiService
  ) {}

  findTitle(release: Release | undefined, track: MergedTrack): string {
    return release?.tracklist[track.discogsIndex]?.title || '';
  }

  findAppleMusic(trackId: number): any {
    return this.apple[trackId] || '';
  }

  ngOnInit() {
    this.mergedTrackFacade.allMergedTracks$.subscribe(
      (tracks: MergedTrack[]) => {
        this.tracks = tracks.filter((track) => !!track.video);
      }
    );

    this.discogsReleasesApiService.allDiscogsRelease$.subscribe(
      (releases: Release[]) => {
        this.releases = releases.reduce((prev, curr) => {
          return {
            ...prev,
            [curr.id]: curr,
          };
        }, {});
      }
    );

    this.appleMusicApiService.allAppleMusicTracks$.subscribe((tracks) => {
      this.apple = tracks.reduce((prev, curr) => {
        return {
          ...prev,
          [curr['Track ID']]: curr,
        };
      }, {});
    });
  }
}
