import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeTypedUiModule } from '@playlistr/fe/typed-ui';
import { MergedTracksComponent } from './merged.tracks.component';

@NgModule({
  imports: [CommonModule, FeTypedUiModule],
  declarations: [MergedTracksComponent],
  exports: [MergedTracksComponent],
})
export class FeTracksFeaturesMergedTracksModule {}
