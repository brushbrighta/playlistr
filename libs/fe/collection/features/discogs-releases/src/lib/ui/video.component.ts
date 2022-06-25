import { Component, Input } from '@angular/core';
import { Video } from '@playlistr/shared/types';
@Component({
  selector: 'plstr-release-video',
  template: `
    <div
      *ngIf="video"
      style="border-radius: 4px; padding: 5px; font-size: smaller; background: #f0f0f0"
    >
      <div (click)="showVideo = !showVideo" style="cursor: pointer">
        {{ video.title }}
      </div>
      <div *ngIf="showVideo">
        <iframe
          id="myIframe"
          width="560"
          height="315"
          [src]="video.uri.replace('watch?v=', 'embed/') | safe: 'resourceUrl'"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  `,
})
export class ReleaseVideoComponent {
  @Input() video: Video | null = null;
  showVideo = false;
}
