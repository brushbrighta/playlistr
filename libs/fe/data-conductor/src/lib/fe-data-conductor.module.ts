import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeAppleMusicApiModule } from '@playlistr/fe/apple-music/api';
import { FeDiscogsCollectionApiModule } from '@playlistr/fe-discogs-collection-api';
import { FeExtendedTrackApiModule } from '@playlistr/fe-extended-track-api';
import { ConductedDataService } from './conducted-data.service';
import { FeTrackFilterApiModule } from '@playlistr/fe/track-filter/api';

@NgModule({
  imports: [
    CommonModule,
    FeAppleMusicApiModule,
    FeDiscogsCollectionApiModule,
    FeExtendedTrackApiModule,
    FeTrackFilterApiModule,
  ],
  providers: [ConductedDataService],
})
export class FeDataConductorModule {}
