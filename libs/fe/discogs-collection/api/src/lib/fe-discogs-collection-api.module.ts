import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscogsReleaseDataAccessModule } from '@playlistr/fe-discogs-collection-data-access';
import { DiscogsReleasesApi } from './discogs-releases.api';

@NgModule({
  imports: [CommonModule, DiscogsReleaseDataAccessModule],
  providers: [DiscogsReleasesApi],
})
export class FeDiscogsCollectionApiModule {}
