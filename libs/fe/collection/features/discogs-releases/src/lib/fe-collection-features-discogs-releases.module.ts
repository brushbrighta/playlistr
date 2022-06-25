import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleaseComponent } from './ui/release.component';
import { SafePipe } from './ui/save-url.pipe';
import { ReleaseVideoComponent } from './ui/video.component';
import { DiscogsReleaseDataAccessModule } from '@playlistr/fe/collection/data-access';
import { ReleasesListComponent } from './releases-list.component';

@NgModule({
  imports: [CommonModule, DiscogsReleaseDataAccessModule],
  declarations: [
    ReleaseComponent,
    ReleaseVideoComponent,
    ReleasesListComponent,
    SafePipe,
  ],
  exports: [ReleasesListComponent],
})
export class FeCollectionFeaturesDiscogsReleasesModule {}
