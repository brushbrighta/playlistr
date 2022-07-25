import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeAppleMusicApiModule } from '@playlistr/fe/apple-music/api';
import { FeDiscogsCollectionApiModule } from '@playlistr/fe/collection/api';
import { FeTracksApiModule } from '@playlistr/fe/tracks/api';
import { ConductedDataService } from './conducted-data.service';

@NgModule({
  imports: [
    CommonModule,
    FeAppleMusicApiModule,
    FeDiscogsCollectionApiModule,
    FeTracksApiModule,
  ],
  providers: [ConductedDataService],
})
export class FeDataConductorModule {}
