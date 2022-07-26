import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeAppleMusicDataAccessModule } from '@playlistr/fe/apple-music/data-access';
import { AppleMusicApi } from './apple-music.api';

@NgModule({
  imports: [CommonModule, FeAppleMusicDataAccessModule],
  providers: [AppleMusicApi],
})
export class FeAppleMusicApiModule {}
