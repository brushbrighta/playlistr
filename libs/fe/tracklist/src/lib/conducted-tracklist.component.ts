import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import {
  ConductedDataService,
  ConductedTrack,
} from '@playlistr/fe/data-conductor';

@Component({
  selector: 'plstr-conducted-tracks',
  template: `<plstr-tracklist-ui
    [tracks]="tracks$ | async"
  ></plstr-tracklist-ui>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConductedTracklistComponent implements OnInit {
  tracks$: Observable<ConductedTrack[]> =
    this.conductedDataService.conductedTracks$;

  constructor(private conductedDataService: ConductedDataService) {}

  ngOnInit() {
    this.tracks$.subscribe((list) =>
      console.log('count with video', list.filter((l) => !!l.video).length)
    );
  }
}
