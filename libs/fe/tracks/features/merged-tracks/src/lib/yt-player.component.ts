import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

let apiLoaded = false;

@Component({
  selector: 'pl-yt-player',
  template: `<div *ngIf="videoId">
    <youtube-player
      #ytPLayer
      [videoId]="videoId"
      (ready)="play()"
      (stateChange)="stateChange($event)"
    ></youtube-player>
  </div>`,
})
export class YtPlayerComponent implements OnInit {
  // @ViewChild('ytPLayer', { static: true }) pLayer?: YouTubePlayer;
  @ViewChild(YouTubePlayer, { static: false }) pLayer?: YouTubePlayer;
  @Input() videoId: string | null = null;

  constructor() {}

  play() {
    this.pLayer?.playVideo();
  }

  stateChange(event: YT.OnStateChangeEvent) {
    console.log('YT event', event);
    if (event.data === 5) {
      this.play();
    }
    if (event.data === 0) {
      // the video is end, do something here.
    }
  }

  ngOnInit() {
    if (!apiLoaded) {
      // This code loads the IFrame Player API code asynchronously, according to the instructions at
      // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      apiLoaded = true;
    }
  }
}
