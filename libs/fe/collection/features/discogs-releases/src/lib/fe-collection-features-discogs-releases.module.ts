import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscogsReleaseDataAccessModule } from '@playlistr/fe/collection/data-access';
import { ReleasesListComponent } from './releases-list.component';
import { FeTypedUiModule } from '@playlistr/fe/typed-ui';

@NgModule({
  imports: [CommonModule, DiscogsReleaseDataAccessModule, FeTypedUiModule],
  declarations: [ReleasesListComponent],
  exports: [ReleasesListComponent],
})
export class FeCollectionFeaturesDiscogsReleasesModule {}
