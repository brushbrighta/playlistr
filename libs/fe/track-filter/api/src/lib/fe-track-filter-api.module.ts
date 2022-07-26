import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeTrackFilterDataAccessModule } from '@playlistr/fe/track-filter/data-access';
import { TrackFilterApi } from './track-filter.api';

@NgModule({
  imports: [CommonModule, FeTrackFilterDataAccessModule],
  providers: [TrackFilterApi],
})
export class FeTrackFilterApiModule {}
