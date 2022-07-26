import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeExtendedTrackDataAccessModule } from '@playlistr/fe-extended-track-data-access';
import { MergedTracksApi } from './merged-tracks.api';

@NgModule({
  imports: [CommonModule, FeExtendedTrackDataAccessModule],
  providers: [MergedTracksApi],
})
export class FeExtendedTrackApiModule {}
