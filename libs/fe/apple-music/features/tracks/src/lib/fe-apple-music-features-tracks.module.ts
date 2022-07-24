import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppleMusicTracksComponent } from './apple-music-tracks.component';
import { RouterModule, Routes } from '@angular/router';
import { FeAppleMusicDataAccessModule } from '@playlistr/fe/apple-music/data-access';
import { FeTypedUiModule } from '@playlistr/fe/typed-ui';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppleMusicSingleTrackComponent } from './ui/apple-music-single-track.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FeTracksApiModule } from '@playlistr/fe/tracks/api';
import { FeCollectionApiModule } from '@playlistr/fe/collection/api';
export const routes: Routes = [
  {
    path: '',
    component: AppleMusicTracksComponent,
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    NgxAudioPlayerModule,
    RouterModule.forChild(routes),
    FeAppleMusicDataAccessModule,
    FeTracksApiModule,
    FeCollectionApiModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FeTypedUiModule,
  ],
  declarations: [AppleMusicTracksComponent, AppleMusicSingleTrackComponent],
})
export class FeAppleMusicFeaturesTracksModule {}
