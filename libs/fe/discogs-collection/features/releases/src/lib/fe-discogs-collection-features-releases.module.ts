import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscogsReleaseDataAccessModule } from '@playlistr/fe-discogs-collection-data-access';
import { ReleasesListComponent } from './releases-list.component';
import { DiscogsReleaseModule } from '@playlistr/fe/typed-ui';

@NgModule({
  imports: [CommonModule, DiscogsReleaseDataAccessModule, DiscogsReleaseModule],
  declarations: [ReleasesListComponent],
  exports: [ReleasesListComponent],
})
export class FeDiscogsCollectionFeaturesReleasesModule {}
