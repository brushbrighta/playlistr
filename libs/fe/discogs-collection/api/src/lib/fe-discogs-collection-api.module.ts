import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscogsReleaseDataAccessModule } from '@playlistr/fe-discogs-collection-data-access';
import { DiscogsReleasesApiService } from './discogsReleasesApiService';

@NgModule({
  imports: [CommonModule, DiscogsReleaseDataAccessModule],
  providers: [DiscogsReleasesApiService],
})
export class FeDiscogsCollectionApiModule {}
