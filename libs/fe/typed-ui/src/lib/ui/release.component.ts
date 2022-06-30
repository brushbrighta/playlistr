import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Release } from '@playlistr/shared/types';
@Component({
  selector: 'plstr-release',
  template: `
    <div *ngIf="release">
      <div style="float: left; margin: 0 20px 20px 0">
        <img
          style="width: 100px; height: auto"
          [src]="'http://localhost:3333/' + release.id + '.png'"
          (error)="onFetchImage(release.id)"
        />
      </div>

      <div>
        <h3>{{ release.artists[0].name }} - {{ release.title }}</h3>
        <span>{{ release.id}}</span> &ndash;
        <span>{{ release.date_changed | date }}</span> &ndash;
        <button (click)="onFetchImage(release.id)">Fetch image</button>
<!--        <ul *ngFor="let track of release.tracklist">-->
<!--          <li>-->
<!--            <small>{{ track.title }}</small>-->
<!--          </li>-->
<!--        </ul>-->
<!--        <ul *ngFor="let video of release.videos">-->
<!--          <plstr-release-video [video]="video"></plstr-release-video>-->
<!--        </ul>-->
      </div>
      <hr style="clear: both"/>
    </div>
  `,
})
export class ReleaseComponent {
  @Input() release: Release | null = null;
  @Output() fetchImage: EventEmitter<number> = new EventEmitter<number>();

  onFetchImage(releaseId: number) {
    this.fetchImage.emit(releaseId);
  }
}
