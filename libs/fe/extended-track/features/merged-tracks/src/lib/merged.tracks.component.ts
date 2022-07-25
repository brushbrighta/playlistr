import { Component, OnInit } from '@angular/core';
import { AppleMusicApiService } from '@playlistr/fe/apple-music/api';
import { BehaviorSubject, map, Observable, pipe, take } from 'rxjs';
import { CombinedTrack, MergedTracksService } from './merged.tracks.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'pl-merged-tracks',
  template: `
    <h1>Found {{ (tracks$ | async)?.length }} tracks in collection</h1>
    <pl-tracks-filter
      [genreFilter]="getGenreFilter$ | async"
      [moodFilter]="getMoodFilter$ | async"
      [setFilter]="getSetFilter$ | async"
      [allGenres]="allGenres$ | async"
      [allMoods]="allMoods$ | async"
      [allSets]="allSets$ | async"
      (setGenreFilter)="setGenreFilter($event)"
      (setMoodFilter)="setMoodFilter($event)"
      (setSetFilter)="setSetFilter($event)"
    ></pl-tracks-filter>
    <button (click)="resetFilter()">Reset</button>
    <button (click)="toggleVideo()">
      {{ (onlyVideo$ | async) ? 'Mit und ohne Video' : 'Nur mit Video' }}
    </button>
    <button (click)="toggleAppleMusic()">
      {{ (appleMissing$ | async) ? 'Alle' : 'Apple fehlt' }}
    </button>
    <button *ngIf="!!videoId" (click)="closeVideo()">Close Video</button>

    <div style="position: fixed; bottom: 0; width: 100%; ">
      <pl-yt-player [videoId]="videoId" (stopped)="playNext()"></pl-yt-player>
    </div>
    <!--    <h4>No Apple music ?</h4>-->
    <!--    <div style="column-count: 6">-->
    <!--        <div *ngFor="let track of (noAppletracks$ | async); let i = index" style="clear: both; display: inline-block; white-space: nowrap; padding: 4px;">-->
    <!--            <img-->
    <!--              style="width:20px; margin: 4px; height: auto; float: left"-->
    <!--              [src]="'/' + track.track.discogsreleaseId + '.png'"-->
    <!--            />-->
    <!--            <h6 *ngIf="track && track.discogsRelease &&  track.discogsRelease.artists.length ">-->
    <!--              {{ track.discogsRelease.artists && track.discogsRelease.artists.length ? track.discogsRelease.artists[0].name : '' }}-->
    <!--              - {{ track.discogsTrack?.title }}-->
    <!--            </h6>-->
    <!--      </div>-->
    <!--    </div>-->
    <div
      *ngFor="let track of tracks$ | async; let i = index"
      style="clear: both"
    >
      <div style="float: left; margin: 0 20px 20px 0">
        <img
          style="width:60px; height: auto"
          [src]="'/images/' + track.track.discogsreleaseId + '.png'"
        />
      </div>
      <h3
        *ngIf="
          track && track.discogsRelease && track.discogsRelease.artists.length
        "
      >
        {{
          track.discogsRelease.artists && track.discogsRelease.artists.length
            ? track.discogsRelease.artists[0].name
            : ''
        }}
        - {{ track.discogsTrack?.title }}
      </h3>
      <div *ngIf="track.appleMusicTrack as details">
        <h1 *ngIf="details.Loved === ''" style="color: red; float: right">
          ❤️
        </h1>
        <div>Genre: {{ details.Genre }}</div>
        <div>Meta: {{ details.Comments }}</div>
      </div>
      <plstr-release-video
        (plaVideo)="videoId = $event; videoTrackIndex = i"
        [video]="track.track.video"
      ></plstr-release-video>
    </div>
  `,
})
export class MergedTracksComponent implements OnInit {
  onlyVideo$ = new BehaviorSubject(false);
  appleMissing$ = new BehaviorSubject(false);

  getSetFilter$ = this.appleMusicApiService.getSetFilter$;
  getMoodFilter$ = this.appleMusicApiService.getMoodFilter$;
  getGenreFilter$ = this.appleMusicApiService.getGenreFilter;

  tracks$: Observable<CombinedTrack[]> = combineLatest([
    this.mergedTracksService.combineDataWithFilters(),
    this.onlyVideo$,
    this.appleMissing$,
  ]).pipe(
    map(([tracks, onlyVideo, appleMissing]) => {
      if (!onlyVideo && !appleMissing) {
        return tracks;
      }
      return tracks.filter((t) => {
        if (onlyVideo && !t.track.video) {
          return false;
        } else if (appleMissing && !!t.track.appleMusicTrackId) {
          return false;
        }
        return true;
      });
    })
  );

  noAppletracks$: Observable<CombinedTrack[]> = this.mergedTracksService
    .combineDataWithFilters()
    .pipe(
      map((tracks) => {
        return tracks.filter((t) => !t.appleMusicTrack);
      })
    );

  videoId: string | null = null;
  videoTrackIndex: number | null = null;
  allMoods$: Observable<string[]> = this.appleMusicApiService.allMoods$;
  allSets$: Observable<string[]> = this.appleMusicApiService.allSets$;
  allGenres$: Observable<string[]> = this.appleMusicApiService.getAllGenres$;

  constructor(
    private mergedTracksService: MergedTracksService,
    private appleMusicApiService: AppleMusicApiService
  ) {}

  closeVideo() {
    this.videoId = null;
  }

  playNext() {
    console.log('playNext');
    this.tracks$.pipe(take(1)).subscribe((tracks) => {
      const nextIndex = Math.floor(Math.random() * tracks.length);
      console.log('playNext', nextIndex);
      this.videoTrackIndex = nextIndex;

      if (
        this.videoTrackIndex !== null &&
        tracks &&
        tracks.length &&
        tracks[this.videoTrackIndex] &&
        tracks[this.videoTrackIndex].track &&
        tracks[this.videoTrackIndex].track.video &&
        tracks[this.videoTrackIndex]!.track!.video!.uri
      ) {
        // @ts-ignore: Object is possibly 'null'.
        const vid = tracks[this.videoTrackIndex]!.track!.video!.uri;
        const id = vid.replace('https://www.youtube.com/watch?v=', '');
        console.log('playNext', nextIndex, id);
        if (id) {
          this.videoId = id;
        } else {
          this.playNext();
        }
      } else {
        this.playNext();
      }
    });
  }

  setMoodFilter(f: string[]) {
    this.appleMusicApiService.setMoodFilter(f);
  }
  setSetFilter(f: string[]) {
    this.appleMusicApiService.setSetsFilter(f);
  }
  setGenreFilter(f: string[]) {
    this.appleMusicApiService.setGenreFilter(f);
  }

  toggleVideo() {
    this.onlyVideo$.next(!this.onlyVideo$.value);
  }

  toggleAppleMusic() {
    this.appleMissing$.next(!this.appleMissing$.value);
  }

  resetFilter() {
    this.appleMusicApiService.setMoodFilter([]);
    this.appleMusicApiService.setSetsFilter([]);
    this.appleMusicApiService.setGenreFilter([]);
  }

  ngOnInit() {}
}
