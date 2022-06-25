import {
  Component,
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Release } from '@playlistr/shared/types';
import { DiscogsReleaseFacade } from '@playlistr/fe/collection/data-access';
import { combineLatest, from, map, switchMap, tap, timer } from 'rxjs';

interface LetContext<T> {
  ngLet: T;
}

@Component({
  selector: 'pl-releases',
  template: `
    <div *ngFor="let release of releases$ | async">
      <plstr-release [release]="release"></plstr-release>
    </div>
  `,
})
export class ReleasesListComponent implements OnInit {
  title = 'plstr';
  releases$ = this.discogsReleaseFacade.allDiscogsRelease$;

  constructor(private discogsReleaseFacade: DiscogsReleaseFacade) {}

  // fetchImage(id: number) {
  //   this.discogsReleaseFacade.fetchImage(id);
  // }
  ngOnInit() {
    // to iterate softly
    //
    // this.discogsReleaseFacade.allDiscogsRelease$
    //   .pipe(
    //     switchMap((releases) => {
    //       const releasesObs = releases.map((r, i) =>
    //         timer(i * 1000).pipe(
    //           map((_) => r.id),
    //           tap((rid) => this.discogsReleaseFacade.fetchImage(rid))
    //         )
    //       );
    //       return combineLatest(releasesObs);
    //     })
    //   )
    //   .subscribe();
  }
}
