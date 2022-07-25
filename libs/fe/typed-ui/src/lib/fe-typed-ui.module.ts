import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleaseVideoComponent } from './ui/video.component';
import { SafePipe } from './ui/save-url.pipe';
import { ReleaseComponent } from './ui/release.component';
import { YtPlayerComponent } from './ui/yt-player.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, YouTubePlayerModule],
  declarations: [
    ReleaseVideoComponent,
    YtPlayerComponent,
    ReleaseComponent,
    SafePipe,
  ],
  exports: [
    ReleaseVideoComponent,
    YtPlayerComponent,
    ReleaseComponent,
    SafePipe,
  ],
})
export class FeTypedUiModule {}
