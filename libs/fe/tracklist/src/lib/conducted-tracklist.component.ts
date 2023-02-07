import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { map, Observable } from 'rxjs';
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
    </plstr-tracklist-ui>

    <span
      class="animate-ping fixed fixed transition top-6 right-6 w-12 h-12 z-30 rounded border border-gray-800"
    ></span>
    <button
      class="fixed transition top-6 right-6 w-12 h-12 z-40 rounded bg-gray-800 hover:bg-gray-900 border border-teal-800 hover:border-teal-300 text-teal-500 hover:text-teal-300  flex flex-col items-center justify-center"
      (click)="showSettings = true"
    >
      S
    </button>
    <div
      *ngIf="showSettings"
      class="fixed opacity-90 top-2 left-2 right-2 bottom-2 z-50 overflow-hidden bg-gray-800 p-5 flex flex-col items-center justify-center"
    >
      <button
        class="transition absolute  top-6 right-6 w-12 h-12 z-40 rounded bg-gray-700 hover:bg-gray-900 border border-teal-800 hover:border-teal-300 text-teal-500 hover:text-teal-300 hover:outline-2 flex flex-col items-center justify-center"
        (click)="showSettings = false"
      >
        X
      </button>
      <pl-tracks-filter
        [resultCount]="tracksCount$ | async"
        [allGenres]="appleMusicApi.getAllGenres$ | async"
        [allMoods]="appleMusicApi.allMoods$ | async"
        [allSets]="appleMusicApi.allSets$ | async"
      ></pl-tracks-filter>
    </div>
    <!-- TODO make a laoder-component -->
    <div
      *ngIf="tracksLoading$ | async"
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-900 flex flex-col items-center justify-center"
    >
      <div class="relative">
        <span class="h-12 w-12 flex">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-12 w-12 bg-teal-500"
          ></span>
        </span>
      </div>
    </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConductedTracklistComponent implements OnInit {
  showSettings = false;

  tracks$: Observable<ConductedTrack[]> =
    this.conductedDataService.conductedTracksFiltered$;

  tracksCount$: Observable<number> = this.tracks$.pipe(
    map((tracks) => tracks.length)
  );

  tracksLoading$ = this.conductedDataService.loading$;
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
