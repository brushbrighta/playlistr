import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { MERGED_TRACK_FEATURE_KEY } from './+state/merged-track.models';
import { reducer } from './+state/merged-track.reducer';
import { EffectsModule } from '@ngrx/effects';
import { MergedTrackEffects } from './+state/merged-track.effects';
import { MergedTrackFacade } from './+state/merged-track.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(MERGED_TRACK_FEATURE_KEY, reducer),
    EffectsModule.forFeature([MergedTrackEffects]),
  ],
  providers: [MergedTrackFacade],
})
export class FeExtendedTrackDataAccessModule {}
