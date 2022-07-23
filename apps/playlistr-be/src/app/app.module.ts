import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { DiscogsCollectionService } from './discogs/discogs-collection.service';
import { RetrieveTrackBpmService } from './retrieve-track-bpm.service';
import { DataAccessService } from './data-access/data.access.service';
import {AlbumImageService} from "./album-image/album-image.service";
import {MergedTracksService} from "./merged-tracks.service";
import {AppleMusicService} from "./apple-music/apple-music.service";

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [
    AppService,
    AlbumImageService,
    DiscogsCollectionService,
    RetrieveTrackBpmService,
    DataAccessService,
    MergedTracksService,
    AppleMusicService,
  ],
})
export class AppModule {}
