import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MergedTracksApiService } from './mergedTracksApiService';
import { FeTracksDataAccessModule } from '@playlistr/fe/tracks/data-access';

@NgModule({
  imports: [CommonModule, FeTracksDataAccessModule],
  providers: [MergedTracksApiService],
})
export class FeTracksApiModule {}
