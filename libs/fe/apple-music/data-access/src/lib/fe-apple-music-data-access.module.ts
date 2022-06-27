import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './+state/apple-music.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AppleMusicEffects } from './+state/apple-music.effects';
import { AppleMusicFacade } from './+state/apple-music.facade';
import { APPLE_MUSIC_FEATURE_KEY } from './+state/apple-music.models';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(APPLE_MUSIC_FEATURE_KEY, reducer),
    EffectsModule.forFeature([AppleMusicEffects]),
  ],
  providers: [AppleMusicFacade],
})
export class FeAppleMusicDataAccessModule {}
