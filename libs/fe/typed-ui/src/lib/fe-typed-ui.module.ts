import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleaseVideoComponent } from './ui/video.component';
import { SafePipe } from './ui/save-url.pipe';
import { ReleaseComponent } from './ui/release.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ReleaseVideoComponent, ReleaseComponent, SafePipe],
  exports: [ReleaseVideoComponent, ReleaseComponent],
})
export class FeTypedUiModule {}
