import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Video } from '@playlistr/shared/types';
@Component({
  selector: 'plstr-release-video',
  template: `
    <div
      *ngIf="video"
      style="border-radius: 4px; padding: 5px; font-size: smaller; background: #f0f0f0"
    >
      <div (click)="onPlayVideo()" style="cursor: pointer">
        {{ video.title }}
      </div>
    </div>
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
