import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeTypedUiModule } from '@playlistr/fe/typed-ui';
import { MergedTracksComponent } from './merged.tracks.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { YtPlayerComponent } from './yt-player.component';
import { FeAppleMusicApiModule } from '@playlistr/fe/apple-music/api';
import { FeCollectionApiModule } from '@playlistr/fe/collection/api';
import { FeTracksDataAccessModule } from '@playlistr/fe/tracks/data-access';
import {MergedTracksService} from "./merged.tracks.service";

@NgModule({
  imports: [
    CommonModule,
    FeAppleMusicApiModule,
    FeCollectionApiModule,
    FeTracksDataAccessModule,
    FeTypedUiModule,
    YouTubePlayerModule,
  ],
  declarations: [MergedTracksComponent, YtPlayerComponent],
  exports: [MergedTracksComponent],
  providers: [MergedTracksService]
})
export class FeTracksFeaturesMergedTracksModule {}
