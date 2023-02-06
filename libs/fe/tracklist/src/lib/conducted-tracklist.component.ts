import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  ConductedDataService,
  ConductedTrack,
} from '@playlistr/fe/data-conductor';
import { AppleMusicApi } from '@playlistr/fe/apple-music/api';
import { DiscogsReleasesApi } from '@playlistr/fe-discogs-collection-api';
import {
  ANGULAR_ENVIRONMENT_SERVICE,
  IEnvironmentService,
} from '@playlistr/fe/environment';

@Component({
  selector: 'plstr-conducted-tracks',
  template: `<!-- <button-->
    <!--      style="position: absolute; z-index: 33;"-->
    <!--      (click)="refresh()"-->
    <!--    >-->
    <!--      Refresh-->
    <!--    </button>-->
    <!--    <br /><br /><br /><br />-->

    <plstr-tracklist-ui
      [tracks]="tracks$ | async"
      [minimalUi]="minmalUi"
      (refreshRelease)="discogsReleasesApi.refreshRelease($event)"
      (fetchImage)="discogsReleasesApi.fetchImage($event)"
    >
      <!--      <pl-tracks-filter-->
      <!--        [allGenres]="appleMusicApi.getAllGenres$ | async"-->
      <!--        [allMoods]="appleMusicApi.allMoods$ | async"-->
      <!--        [allSets]="appleMusicApi.allSets$ | async"-->
      <!--      ></pl-tracks-filter>-->
    </plstr-tracklist-ui>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConductedTracklistComponent implements OnInit {
  tracks$: Observable<ConductedTrack[]> =
    this.conductedDataService.conductedTracksFiltered$;

  minmalUi = this.environmentService.isStaticApp;

  constructor(
    private conductedDataService: ConductedDataService,
    public appleMusicApi: AppleMusicApi,
    public discogsReleasesApi: DiscogsReleasesApi,
    @Inject(ANGULAR_ENVIRONMENT_SERVICE)
    private environmentService: IEnvironmentService
  ) {}

  ngOnInit() {
    this.tracks$.subscribe((list) => {
      console.log('count with video', list.filter((l) => !!l.video).length);
      console.log(
        'count with video without duplicates',
        new Set(list.filter((l) => !!l.video).map((l) => l.video!!.uri)).size
      );
    });
  }

  refresh() {
    this.appleMusicApi.refresh();
  }
}
