import {
  AfterViewInit,
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
  template: `
    <!--    <div *ngFor="let vid of [videoId]">-->
    <div #parent style="width: 100%">
      <youtube-player
        #ytPLayer
        [videoId]="videoId"
        [width]="parent.getBoundingClientRect().width"
        [height]="(parent.getBoundingClientRect().width * 3) / 4"
        (ready)="play($event)"
        (stateChange)="stateChange($event)"
      ></youtube-player>
    </div>
    <!--  </div>-->
  `,
})
export class YtPlayerComponent implements OnInit, AfterViewInit {
  // @ViewChild('ytPLayer', { static: true }) pLayer?: YouTubePlayer;
  @ViewChild(YouTubePlayer, { static: false }) tubePlayer?: YouTubePlayer;
  @Input() videoId: string | null = null;
  @Input() fullScreen = true;
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngAfterViewInit() {
    try {
      // @ts-ignore
      this.tubePlayer.playerVars = {
        enablejsapi: 1,
        autoplay: 1,
        modestbranding: 1,
      };
    } catch (e) {
      alert(e);
    }
    // alert(this.tubePlayer);
  }

  play(event?: YT.PlayerEvent) {
    console.log('trying', this.videoId);
    setTimeout(() => {
      if (
        typeof event !== 'undefined' &&
        event.target.getPlayerState() === -1
      ) {
        console.log('play not worked');
        this.onStopped();
      }
      // @ts-ignore
      this.tubePlayer.playVideo();
    });
    // double check after 2 sec if somethings playing
    setTimeout(() => {
      // @ts-ignore
      console.log(
        'this.tubePlayer?.getPlayerState()',
        this.tubePlayer?.getPlayerState()
      );
      // @ts-ignore
      if (
        this.tubePlayer?.getPlayerState() === 0 ||
        this.tubePlayer?.getPlayerState() === 5
      ) {
        this.onStopped();
      }
    }, 2000);
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
