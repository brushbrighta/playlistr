import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleaseComponent } from './release.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ReleaseComponent],
  exports: [ReleaseComponent],
})
export class DiscogsReleaseModule {}
