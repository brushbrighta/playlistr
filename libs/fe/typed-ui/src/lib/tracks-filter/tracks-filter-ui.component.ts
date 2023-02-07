import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'pl-tracks-filter-ui',
  template: `
    <div class="flex"></div>
    <div class="text-slate-50">
      <mat-form-field>
        <mat-label>Search-Term</mat-label>
        <input
          matInput
          placeholder="Search"
          (input)="searchTermChange($event)"
        />
      </mat-form-field>
      &nbsp;
      <mat-slide-toggle
        [checked]="onlyVideo"
        (change)="videoFilterChange($event)"
        >Video only</mat-slide-toggle
      >
      &nbsp;
      <mat-slide-toggle
        [checked]="onlyFavorites"
        (change)="onlyFavoritesFilter($event)"
        >Favs only</mat-slide-toggle
      >
      &nbsp;
    </div>
    <mat-form-field>
      <mat-label>Genres</mat-label>
      <mat-select
        multiple
        (selectionChange)="genreFilterChange($event)"
        [value]="genreFilter"
      >
        <mat-option *ngFor="let genre of allGenres" [value]="genre">{{
          genre
        }}</mat-option>
      </mat-select> </mat-form-field
    >&nbsp;
    <!--    <mat-form-field>-->
    <!--      <mat-label>Mood</mat-label>-->
    <!--      <mat-select-->
    <!--        multiple-->
    <!--        (selectionChange)="moodFilterChange($event)"-->
    <!--        [value]="moodFilter"-->
    <!--      >-->
    <!--        <mat-option *ngFor="let mood of allMoods" [value]="mood">{{-->
    <!--          mood-->
    <!--        }}</mat-option>-->
    <!--      </mat-select> </mat-form-field-->
    <!--    >&nbsp;-->
    <mat-form-field>
      <mat-label>Energy-Level</mat-label>
      <mat-select
        multiple
        (selectionChange)="setFilterChange($event)"
        [value]="setFilter"
      >
        <mat-option *ngFor="let set of allSets" [value]="set">{{
          set
        }}</mat-option>
      </mat-select>
    </mat-form-field>
    <div class="py-5 text-teal-600 text-8xl">{{ resultCount }} Tracks</div>
  `,
})
export class TracksFilterUiComponent implements OnInit {
  @Input() genreFilter: string[] = [];
  @Input() moodFilter: string[] = [];
  @Input() setFilter: string[] = [];
  @Input() onlyVideo: boolean = false;
  @Input() onlyFavorites: boolean = false;
  @Input() searchTerm: string = '';
  @Input() resultCount = 0;
  @Input() allGenres: string[] = [];
  @Input() allMoods: string[] = [];
  @Input() allSets: string[] = [];

  @Output() setGenreFilter: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();
  @Output() setMoodFilter: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();
  @Output() setSetFilter: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Output() setVideoFilter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() setSearchTerm: EventEmitter<string> = new EventEmitter<string>();

  @Output() setOnlyFavoritesFilter: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  ngOnInit() {}

  genreFilterChange(val: MatSelectChange) {
    this.setGenreFilter.emit(val.value);
  }

  moodFilterChange(val: MatSelectChange) {
    this.setMoodFilter.emit(val.value);
  }

  setFilterChange(val: MatSelectChange) {
    this.setSetFilter.emit(val.value);
  }

  searchTermChange(val: Event) {
    this.setSearchTerm.emit(
      (val.currentTarget as HTMLInputElement).value as string
    );
  }

  videoFilterChange(val: MatSlideToggleChange) {
    this.setVideoFilter.emit(val.checked);
  }

  onlyFavoritesFilter(val: MatSlideToggleChange) {
    this.setOnlyFavoritesFilter.emit(val.checked);
  }
}
