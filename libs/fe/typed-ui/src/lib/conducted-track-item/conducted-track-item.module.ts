import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeDataConductorModule } from '@playlistr/fe/data-conductor';
import { ConductedTrackItem } from './conducted-track-item.component';
import { YoutubeUiModule } from '../youtube/youtube.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  imports: [
    CommonModule,
    FeDataConductorModule,
    YoutubeUiModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
  ],
  declarations: [ConductedTrackItem],
  exports: [ConductedTrackItem],
})
export class ConductedTrackItemModule {}
