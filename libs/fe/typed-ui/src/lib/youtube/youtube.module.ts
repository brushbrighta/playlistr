import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleaseVideoComponent } from './video.component';
import { YtPlayerComponent } from './yt-player.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, YouTubePlayerModule],
  declarations: [ReleaseVideoComponent, YtPlayerComponent],
  exports: [ReleaseVideoComponent, YtPlayerComponent],
})
export class YoutubeUiModule {}
