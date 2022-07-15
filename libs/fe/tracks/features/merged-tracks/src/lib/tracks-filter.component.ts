import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'pl-tracks-filter',
  template: `
    <div style="background: #333; padding: 10px; ">
      <mat-form-field>
        <mat-label>Genre</mat-label>
        <mat-select multiple (selectionChange)="genreFilterChange($event)" [value]="genreFilter">
          <mat-option *ngFor="let genre of allGenres" [value]="genre">{{genre}}</mat-option>
        </mat-select>
      </mat-form-field>&nbsp;
      <mat-form-field>
        <mat-label>Mood</mat-label>
        <mat-select multiple (selectionChange)="moodFilterChange($event)" [value]="moodFilter">
          <mat-option *ngFor="let mood of allMoods" [value]="mood">{{mood}}</mat-option>
        </mat-select>
      </mat-form-field>&nbsp;
      <mat-form-field>
        <mat-label>Set-Energy-Level</mat-label>
        <mat-select multiple (selectionChange)="setFilterChange($event)" [value]="setFilter">
          <mat-option *ngFor="let set of allSets" [value]="set">{{set}}</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `,
})
export class TracksFilterComponent implements OnInit {

  @Input() genreFilter: string[] = [];
  @Input() moodFilter: string[] = [];
  @Input() setFilter: string[] = [];

  @Input() allGenres: string[] = [];
  @Input() allMoods: string[] = [];
  @Input() allSets: string[] = [];

  @Output() setGenreFilter: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() setMoodFilter: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() setSetFilter: EventEmitter<string[]> = new EventEmitter<string[]>();

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
}

