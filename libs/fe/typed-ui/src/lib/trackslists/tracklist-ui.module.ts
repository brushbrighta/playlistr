import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeDataConductorModule } from '@playlistr/fe/data-conductor';
import { TracklistComponent } from './tracklist.component';
import { ConductedTrackItemModule } from '../conducted-track-item/conducted-track-item.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { YoutubeUiModule } from '../youtube/youtube.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  imports: [
    CommonModule,
    ConductedTrackItemModule,
    FeDataConductorModule,
    YoutubeUiModule,
    ScrollingModule,
    NgxAudioPlayerModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [TracklistComponent],
  exports: [TracklistComponent],
})
export class FeTracklistModule {}
