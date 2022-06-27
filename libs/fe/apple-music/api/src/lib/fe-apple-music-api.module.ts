import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeAppleMusicDataAccessModule } from '@playlistr/fe/apple-music/data-access';
import { AppleMusicApiService } from './appleMusicApiService';

@NgModule({
  imports: [CommonModule, FeAppleMusicDataAccessModule],
  providers: [AppleMusicApiService],
})
export class FeAppleMusicApiModule {}
