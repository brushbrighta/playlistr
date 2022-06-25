import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromDiscogsRelease from './+state/discogs-release.reducer';
import { DiscogsReleaseEffects } from './+state/discogs-release.effects';
import { DiscogsReleaseFacade } from './+state/discogs-release.facade';
import { DISCOGS_RELEASE_FEATURE_KEY } from './+state/discogs-release.models';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      DISCOGS_RELEASE_FEATURE_KEY,
      fromDiscogsRelease.reducer
    ),
    EffectsModule.forFeature([DiscogsReleaseEffects]),
  ],
  providers: [DiscogsReleaseFacade],
})
export class DiscogsReleaseDataAccessModule {}
