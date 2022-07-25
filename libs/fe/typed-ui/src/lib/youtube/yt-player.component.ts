import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

let apiLoaded = false;

@Component({
  selector: 'pl-yt-player',
  template: `<div *ngFor="let vid of [videoId]">
    <div *ngIf="vid" #parent style="width: 100%">
      <youtube-player
        #ytPLayer
        [videoId]="vid"
        [width]="parent.getBoundingClientRect().width"
        [height]="600"
        (ready)="play($event)"
        (stateChange)="stateChange($event)"
      ></youtube-player>
    </div>
  </div>`,
})
export class YtPlayerComponent implements OnInit {
  // @ViewChild('ytPLayer', { static: true }) pLayer?: YouTubePlayer;
  @ViewChild(YouTubePlayer, { static: false }) pLayer?: YouTubePlayer;
  @Input() videoId: string | null = null;
  @Input() fullScreen = true;
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  play(event?: YT.PlayerEvent) {
    if (typeof event !== 'undefined' && event.target.getPlayerState() === -1) {
      console.log('play not worked');
      this.onStopped();
    }
    this.pLayer?.playVideo();
  }

  onStopped() {
    this.stopped.emit();
  }

  stateChange(event: YT.OnStateChangeEvent) {
    console.log('YT event', event, this.videoId);
    if (event.data === 5) {
      this.play();
    }
    if (event.data === 0) {
      this.onStopped();
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
