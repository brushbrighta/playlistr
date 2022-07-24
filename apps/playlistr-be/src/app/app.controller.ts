import {Controller, Get, Logger, Param, Post, Put} from '@nestjs/common';

import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { AppleMusicTrack, MergedTrack, Release } from '@playlistr/shared/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('collection')
  getCollection(): Observable<Release[]> {
    return this.appService.getCollection();
  }

  @Get('tracks')
  getTracks(): Promise<Observable<MergedTrack[]>> {
    return this.appService.getTracks();
  }

  // zu get-image-for-release
  @Get('add-image-to-release/:id')
  addImage(@Param('id') id: string): Promise<null> {
    return this.appService.addImage(id);
  }

  @Get('update-release/:id')
  updateRelease(@Param('id') id: string): Observable<Release> {
    return this.appService.updateRelease(parseInt(id, 10));
  }

  @Get('retrieve-bpm/:track_id')
  retrieveBpm(@Param('track_id') track_id: string): Promise<string> {
    return this.appService.retrieveBpm(track_id).catch((e) => {
      Logger.error(e);
      return '';
    });
  }

  // must be post
  @Post('refresh-apple-music')
  convertAppleMusic(): Observable<AppleMusicTrack[]> {
    return this.appService.convertAppleMusic();
  }

  @Get('apple-music')
  appleMusic(): Observable<AppleMusicTrack[]> {
    return this.appService.getAppleMusicJson();
  }
}
