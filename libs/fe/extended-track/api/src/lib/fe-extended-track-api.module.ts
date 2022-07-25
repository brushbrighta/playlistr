import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MergedTracksApiService } from './mergedTracksApiService';
import { FeExtendedTrackDataAccessModule } from '@playlistr/fe-extended-track-data-access';

@NgModule({
  imports: [CommonModule, FeExtendedTrackDataAccessModule],
  providers: [MergedTracksApiService],
})
export class FeExtendedTrackApiModule {}
