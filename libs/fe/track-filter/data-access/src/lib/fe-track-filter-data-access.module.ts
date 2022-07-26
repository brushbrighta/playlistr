import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './+state/track-filter.reducer';
import { TRACK_FILTER_FEATURE_KEY } from './+state/track-filter.models';
import { TrackFilterFacade } from './+state/track-filter.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(TRACK_FILTER_FEATURE_KEY, reducer),
  ],
  providers: [TrackFilterFacade],
})
export class FeTrackFilterDataAccessModule {}
