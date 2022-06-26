import { Component, OnInit } from '@angular/core';
import { TracksApiService } from '@playlistr/fe/api';
import { Dictionary, MergedTrack, Release } from '@playlistr/shared/types';
import { DiscogsReleaseFacade } from '@playlistr/fe/collection/data-access';
import { AppleMusicTracksApiService } from '../../../../../api/src/lib/apple-tracks.api.service';

@Component({
  selector: 'pl-merged-tracks',
  template: `
    <h1>Found {{ tracks.length }} tracks with videos in collection</h1>
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
        <div>Genre: {{ details.Genre }}</div>
        <div>Meta: {{ details.Comments }}</div>
      </div>
      <plstr-release-video [video]="track.video"></plstr-release-video>
    </div>
  `,
})
export class MergedTracksComponent implements OnInit {
  tracks: MergedTrack[] = [];
  releases: Dictionary<Release> = {};
  apple: Dictionary<any> = {};

  constructor(
    private tracksApiService: TracksApiService,
    private appleMusicTracksApiService: AppleMusicTracksApiService,
    private discogsReleaseFacade: DiscogsReleaseFacade
  ) {}

  findTitle(release: Release | undefined, track: MergedTrack): string {
    return release?.tracklist[track.discogsIndex]?.title || '';
  }

  findAppleMusic(trackId: number): any {
    return this.apple[trackId] || '';
  }

  ngOnInit() {
    this.tracksApiService.getTracks().subscribe((tracks) => {
      this.tracks = tracks.filter((track) => !!track.video);
    });

    this.discogsReleaseFacade.allDiscogsRelease$.subscribe((releases) => {
      this.releases = releases.reduce((prev, curr) => {
        return {
          ...prev,
          [curr.id]: curr,
        };
      }, {});
    });

    this.appleMusicTracksApiService
      .getAppleMusicTracks()
      .subscribe((tracks) => {
        this.apple = tracks.reduce((prev, curr) => {
          return {
            ...prev,
            [curr['Track ID']]: curr,
          };
        }, {});
      });
  }
}
