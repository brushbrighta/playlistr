import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Video } from '@playlistr/shared/types';
@Component({
  selector: 'plstr-release-video',
  template: `
    <button mat-icon-button (click)="onPlayVideo()" [disabled]="!video">
      <!--      <mat-icon>music_video</mat-icon>-->
      <img style="width: 28px; height: 28px;" src="assets/youtube.svg" />
    </button>
  `,
})
export class ReleaseVideoComponent {
  @Input() video: Video | null = null;
  @Output() plaVideo: EventEmitter<string> = new EventEmitter();

  onPlayVideo() {
    const id = this.video?.uri.replace('https://www.youtube.com/watch?v=', '');
    this.plaVideo.emit(id);
  }
}
