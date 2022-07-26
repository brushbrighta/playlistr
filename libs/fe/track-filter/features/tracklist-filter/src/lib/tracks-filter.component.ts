import { Component, Input } from '@angular/core';
import { TrackFilterFacade } from '@playlistr/fe/track-filter/data-access';

@Component({
  selector: 'pl-tracks-filter',
  template: `
    <pl-tracks-filter-ui
      [genreFilter]="trackFilterFacade.getGenreFilter$ | async"
      [moodFilter]="trackFilterFacade.getMoodFilter$ | async"
      [setFilter]="trackFilterFacade.getSetFilter$ | async"
      [onlyVideo]="trackFilterFacade.getVideoFilter$ | async"
      [searchTerm]="trackFilterFacade.getSearchTerm$ | async"
      [allGenres]="allGenres"
      [allMoods]="allMoods"
      [allSets]="allSets"
      (setVideoFilter)="trackFilterFacade.setVideoFilter($event)"
      (setGenreFilter)="trackFilterFacade.setGenreFilter($event)"
      (setMoodFilter)="trackFilterFacade.setMoodFilter($event)"
      (setSetFilter)="trackFilterFacade.setSetFilter($event)"
      (setSearchTerm)="trackFilterFacade.setSearchTerm($event)"
    ></pl-tracks-filter-ui>
  `,
})
export class TracksFilterComponent {
  @Input() allGenres: string[] = [];
  @Input() allMoods: string[] = [];
  @Input() allSets: string[] = [];

  constructor(public trackFilterFacade: TrackFilterFacade) {}
}
