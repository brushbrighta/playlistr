import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { RetrieveAlbumImageService } from './retrieve-album-image.service';
import { RetrieveDiscogsCollectionService } from './retrieve-discogs-collection.service';
import { RetrieveTrackBpmService } from './retrieve-track-bpm.service';
import { DataAccessService } from './data.access.service';
import { RetrieveMergedTracksService } from './retrieve-merged-tracks.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [
    AppService,
    RetrieveAlbumImageService,
    RetrieveDiscogsCollectionService,
    RetrieveTrackBpmService,
    DataAccessService,
    RetrieveMergedTracksService,
  ],
})
export class AppModule {}
