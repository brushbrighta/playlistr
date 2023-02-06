import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeDataConductorModule } from '@playlistr/fe/data-conductor';
import { ConductedTracklistComponent } from './conducted-tracklist.component';
import { CommonModule } from '@angular/common';
import { TracklistComponent } from '@playlistr/fe/typed-ui';
import { FeTrackFilterFeaturesTracklistFilterModule } from '@playlistr/fe/track-filter/features/tracklist-filter';
import { FeAppleMusicApiModule } from '@playlistr/fe/apple-music/api';
import { FeDiscogsCollectionApiModule } from '@playlistr/fe-discogs-collection-api';
import { MatButtonModule } from '@angular/material/button';
export const routes: Routes = [
  {
    path: '',
    component: ConductedTracklistComponent,
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TracklistComponent,
    FeDataConductorModule,
    FeTrackFilterFeaturesTracklistFilterModule,
    FeDiscogsCollectionApiModule,
    FeAppleMusicApiModule,
    MatButtonModule,
  ],
  declarations: [ConductedTracklistComponent],
})
export class FeConductedTracklistModule {}
