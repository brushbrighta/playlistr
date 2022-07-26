import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ConductedDataService,
  ConductedTrack,
} from '@playlistr/fe/data-conductor';
import { AppleMusicApi } from '@playlistr/fe/apple-music/api';

@Component({
  selector: 'plstr-conducted-tracks',
  template: `<!-- <button (click)="refresh()">Refresh</button>-->
    <plstr-tracklist-ui [tracks]="tracks$ | async">
      <pl-tracks-filter
        [allGenres]="appleMusicApi.getAllGenres$ | async"
        [allMoods]="appleMusicApi.allMoods$ | async"
        [allSets]="appleMusicApi.allSets$ | async"
      ></pl-tracks-filter>
    </plstr-tracklist-ui>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConductedTracklistComponent implements OnInit {
  tracks$: Observable<ConductedTrack[]> =
    this.conductedDataService.conductedTracksFiltered$;

  constructor(
    private conductedDataService: ConductedDataService,
    public appleMusicApi: AppleMusicApi
  ) {}

  ngOnInit() {
    this.tracks$.subscribe((list) =>
      console.log('count with video', list.filter((l) => !!l.video).length)
    );
  }

  refresh() {
    this.appleMusicApi.refresh();
  }
}
