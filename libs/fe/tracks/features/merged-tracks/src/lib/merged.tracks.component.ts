import { Component, OnInit } from '@angular/core';
import { AppleMusicApiService } from '@playlistr/fe/apple-music/api';
import {BehaviorSubject, map, Observable, pipe, take} from "rxjs";
import {CombinedTrack, MergedTracksService} from "./merged.tracks.service";
import {combineLatest} from "rxjs";

@Component({
  selector: 'pl-merged-tracks',
  template: `
    <h1>Found {{ (tracks$ | async)?.length }} tracks in collection</h1>
    <button (click)="resetFilter()">Reset</button>
    <button (click)="toggleVideo()">
      {{ (onlyVideo$ | async) ? 'Mit und ohne Video' : 'Nur mit Video'}}
    </button>
    <button *ngIf="!!videoId" (click)="closeVideo()">Close Video</button>
    <div style="">
      <div style="display: inline-block; vertical-align: top; width: 20%">
        <div *ngFor="let m of (allMoods$ | async)" (click)="setMoodFilter(m)" >
          {{ m }}
        </div>
      </div><div style="display: inline-block; vertical-align: top; width: 19%">
      <div *ngFor="let s of (allSets$ | async)" (click)="setSetFilter(s)">
        {{ s }}
      </div>
    </div><div style="display: inline-block; vertical-align: top; width: 59%; column-count: 3">
      <div *ngFor="let s of (allGenres$ | async)" (click)="setGenreFilter(s)">
        {{ s }}
      </div>
    </div>
    </div>

    <div style="position: fixed; bottom: 0; width: 100%; ">
      <pl-yt-player [videoId]="videoId" (stopped)="playNext()"></pl-yt-player>
    </div>
    <div *ngFor="let track of (tracks$ | async); let i = index" style="clear: both">
      <div style="float: left; margin: 0 20px 20px 0">
        <img
          style="width:60px; height: auto"
          [src]="'http://localhost:3333/' + track.track.discogsreleaseId + '.png'"
        />
      </div>
      <h3 *ngIf="track && track.discogsRelease &&  track.discogsRelease.artists.length ">
        {{ track.discogsRelease.artists && track.discogsRelease.artists.length ? track.discogsRelease.artists[0].name : '' }}
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
  tracks$: Observable<CombinedTrack[]> = combineLatest(
    [
      this.mergedTracksService.combineDataWithFilters(),
      this.onlyVideo$
    ]
  ).pipe(map(([tracks, onlyVideo]) => {
    if(!onlyVideo) {
      return tracks;
    }
    return tracks.filter(t => !!t.track.video)
  }));
  videoId: string | null = null;
  videoTrackIndex: (number | null) = null;
  allMoods$: Observable<string[]> = this.appleMusicApiService.allMoods$;
  allSets$: Observable<string[]> = this.appleMusicApiService.allSets$;
  allGenres$: Observable<string[]> = this.appleMusicApiService.getAllGenres$;

  constructor(
    private mergedTracksService: MergedTracksService,
    private appleMusicApiService: AppleMusicApiService,
  ) {}

  closeVideo() {
    this.videoId = null;
  }

  playNext() {
    console.log('playNext');
    this.tracks$.pipe(take(1)).subscribe(tracks => {

      const nextIndex = Math.floor(Math.random() * tracks.length);
      console.log('playNext', nextIndex);
      this.videoTrackIndex = nextIndex;

      if (this.videoTrackIndex !== null &&
        tracks &&
        tracks.length &&
        tracks[this.videoTrackIndex] &&
        tracks[this.videoTrackIndex].track &&
        tracks[this.videoTrackIndex].track.video &&
        tracks[this.videoTrackIndex]!.track!.video!.uri ) {
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
    })
  }

  setMoodFilter(f: string) {
    this.appleMusicApiService.setMoodFilter([f]);
  }
  setSetFilter(f: string) {
    this.appleMusicApiService.setSetsFilter([f]);
  }
  setGenreFilter(f: string) {
    this.appleMusicApiService.setGenreFilter([f]);
  }

  toggleVideo() {
    this.onlyVideo$.next(!this.onlyVideo$.value);
  }

  resetFilter() {
    this.appleMusicApiService.setMoodFilter([]);
    this.appleMusicApiService.setSetsFilter([]);
    this.appleMusicApiService.setGenreFilter([]);
  }


  ngOnInit() {

  }
}
