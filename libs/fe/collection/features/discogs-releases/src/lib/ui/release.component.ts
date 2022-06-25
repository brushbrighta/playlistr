import { Component, Input } from '@angular/core';
import { Release } from '@playlistr/shared/types';
@Component({
  selector: 'plstr-release',
  template: `
    <div *ngIf="release">
      <div style="float: left; margin: 0 20px 20px 0">
        <img
          style="width: 100px; height: auto"
          [src]="'http://localhost:3333/' + release.id + '.png'"
          (error)="fetchImage(release.id)"
        />
      </div>

      <div>
        <h3>{{ release.title }}</h3>

        <!--        <button (click)="fetchImage(release.id)">Fetch image</button>-->
        <ul *ngFor="let track of release.tracklist">
          <li>
            <small>{{ track.title }}</small>
          </li>
        </ul>
        <ul *ngFor="let video of release.videos">
          <plstr-release-video [video]="video"></plstr-release-video>
        </ul>
      </div>
      <hr style="clear: both" />
    </div>
  `,
})
export class ReleaseComponent {
  @Input() release: Release | null = null;

  fetchImage(releaseId: number) {
    console.log('releaseId', releaseId);
  }
}
