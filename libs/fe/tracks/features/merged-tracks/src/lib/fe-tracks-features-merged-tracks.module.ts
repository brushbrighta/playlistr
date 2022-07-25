import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeTypedUiModule } from '@playlistr/fe/typed-ui';
import { MergedTracksComponent } from './merged.tracks.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { FeAppleMusicApiModule } from '@playlistr/fe/apple-music/api';
import { FeDiscogsCollectionApiModule } from '@playlistr/fe/collection/api';
import { FeTracksDataAccessModule } from '@playlistr/fe/tracks/data-access';
import { MergedTracksService } from './merged.tracks.service';
import { TracksFilterComponent } from './tracks-filter.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    FeAppleMusicApiModule,
    FeDiscogsCollectionApiModule,
    FeTracksDataAccessModule,
    FeTypedUiModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  declarations: [MergedTracksComponent, TracksFilterComponent],
  exports: [MergedTracksComponent],
  providers: [MergedTracksService],
})
export class FeTracksFeaturesMergedTracksModule {}
