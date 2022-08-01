import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MergedTrack, Release } from '@playlistr/shared/types';
import {
  ANGULAR_ENVIRONMENT_SERVICE,
  IEnvironmentService,
} from '@playlistr/fe/environment';

@Injectable({
  providedIn: 'root',
})
export class TracksApiService {
  private apiUrl = '/api';
  private isStaticApp = this.environmentService.isStaticApp;

  constructor(
    private httpService: HttpClient,
    @Inject(ANGULAR_ENVIRONMENT_SERVICE)
    private environmentService: IEnvironmentService
  ) {}

  getTracks(): Observable<MergedTrack[]> {
    if (this.isStaticApp) {
      return this.httpService.get<MergedTrack[]>(`collection-tracks.json`);
    }
    return this.httpService.get<MergedTrack[]>(`${this.apiUrl}/tracks`);
  }
}
