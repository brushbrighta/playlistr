import { Controller, Get, Param, Put } from '@nestjs/common';

import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { Release } from '@playlistr/shared/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('collection')
  getCollection(): Observable<Release[]> {
    return this.appService.getCollection();
  }

  @Get('add-image-to-release/:id')
  addImage(@Param('id') id: string): Promise<null> {
    return this.appService.addImage(id);
  }
}
