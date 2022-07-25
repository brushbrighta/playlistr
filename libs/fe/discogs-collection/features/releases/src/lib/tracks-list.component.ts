import {
  Component,
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Release } from '@playlistr/shared/types';
import { DiscogsReleaseFacade } from '@playlistr/fe-discogs-collection-data-access';
import { combineLatest, from, map, switchMap, tap, timer } from 'rxjs';

@Component({
  selector: 'pl-tracks',
  template: `
    <div *ngFor="let release of releases$ | async">
      <plstr-release [release]="release"></plstr-release>
    </div>
  `,
})
export class TracksListComponent implements OnInit {
  title = 'plstr';
  releases$ = this.discogsReleaseFacade.allDiscogsRelease$;

  constructor(private discogsReleaseFacade: DiscogsReleaseFacade) {}

  ngOnInit() {}
}
