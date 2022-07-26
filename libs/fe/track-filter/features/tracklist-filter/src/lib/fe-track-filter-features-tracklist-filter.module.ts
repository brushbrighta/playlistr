import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TracksFilterComponent } from './tracks-filter.component';
import { TracksFilterUiModule } from '@playlistr/fe/typed-ui';

@NgModule({
  imports: [CommonModule, TracksFilterUiModule],
  declarations: [TracksFilterComponent],
  exports: [TracksFilterComponent],
})
export class FeTrackFilterFeaturesTracklistFilterModule {}
