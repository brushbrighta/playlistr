import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeDataConductorModule } from '@playlistr/fe/data-conductor';
import { ConductedTracklistComponent } from './conducted-tracklist.component';
import { CommonModule } from '@angular/common';
import { FeTracklistModule } from '@playlistr/fe/typed-ui';
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
    FeTracklistModule,
    FeDataConductorModule,
  ],
  declarations: [ConductedTracklistComponent],
})
export class FeConductedTracklistModule {}
