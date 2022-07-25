import { ShellComponent } from './shell.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'all-tracks',
        pathMatch: 'full',
      },
      {
        path: 'all-tracks',
        loadChildren: () =>
          import('@playlistr/fe-tracklist').then(
            (m) => m.FeConductedTracklistModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppleMusicShellRoutingModule {}
