import {
  Component,
  OnInit,
} from '@angular/core';
import { DiscogsReleaseFacade } from '@playlistr/fe/collection/data-access';


@Component({
  selector: 'pl-releases',
  template: `
    <div *ngFor="let release of releases$ | async">
      <plstr-release [release]="release" (fetchImage)="fetchImage($event)"></plstr-release>
    </div>
  `,
})
export class ReleasesListComponent implements OnInit {
  title = 'plstr';
  releases$ = this.discogsReleaseFacade.allDiscogsRelease$;

  constructor(private discogsReleaseFacade: DiscogsReleaseFacade) {}

  fetchImage(id: number) {
    this.discogsReleaseFacade.fetchImage(id);
  }
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
