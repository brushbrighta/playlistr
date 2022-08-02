import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'plstr-tags',
  template: `
    <mat-chip-list
      style="display: inline-block; margin-right: 5px;"
      *ngIf="type === 'FAV' && tagString === ''"
    >
      <mat-chip style="background: #ec3c71">
        <mat-icon
          style="font-size: inherit;
          height: 20px;
          text-align: center;
          position: relative;
          top: 4px;"
          >favorite</mat-icon
        >
      </mat-chip>
    </mat-chip-list>
    <mat-chip-list
      *ngIf="type !== 'FAV'"
      style="display: inline-block; margin-right: 5px;"
    >
      <mat-chip
        *ngFor="let tag of tags"
        [style.backgroundColor]="colors[tag] ? colors[tag] : colors.GENRE"
      >
        {{ tag }}
      </mat-chip>
    </mat-chip-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements OnChanges {
  @Input() tagString: string = '';
  @Input() type: 'MOOD' | 'GENRE' | 'ENERGY' | 'FAV' = 'GENRE';
  tags: string[] = [];

  colors = {
    MOOD0: '#e1ea8f',
    MOOD1: '#d3de73',
    MOOD2: '#cad34c',
    MOOD3: '#7ec742',
    MOOD4: '#75ec3b',
    MOOD5: '#42c777',
    SETX: '#9797a4',
    SET0: '#978ba1',
    SET1: '#cdabe0',
    SET2: '#d278cd',
    SET3: '#9409dc',
    SET4: '#4d0377',
    GENRE: '#2b9187',
  };

  filterDiscr = {
    MOOD: 'MOOD',
    ENERGY: 'SET',
    GENRE: '',
    FAV: '',
  };

  ngOnChanges(changes: SimpleChanges) {
    const tagString = changes['tagString'].currentValue;
    if (tagString && tagString.length && this.type !== 'FAV') {
      this.tags = tagString
        .replace(/\//g, this.type === 'GENRE' ? '|' : ' ')
        .split(this.type === 'GENRE' ? '|' : ' ')
        .map((v: string) => v.trim())
        .filter((v: string) => v.startsWith(this.filterDiscr[this.type]));
    } else if (this.type !== 'FAV') {
      this.tags = [];
    }
  }
}
