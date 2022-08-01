import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppleMusicTrack } from '@playlistr/shared/types';
import {
  ANGULAR_ENVIRONMENT_SERVICE,
  IEnvironmentService,
} from '@playlistr/fe/environment';

@Injectable({
  providedIn: 'root',
})
export class AppleMusicTracksApiService {
  private apiUrl = '/api';
  private isStaticApp = this.environmentService.isStaticApp;

  constructor(
    private httpService: HttpClient,
    @Inject(ANGULAR_ENVIRONMENT_SERVICE)
    private environmentService: IEnvironmentService
  ) {}

  getAppleMusicTracks(): Observable<AppleMusicTrack[]> {
    if (this.isStaticApp) {
      return this.httpService.get<AppleMusicTrack[]>(`apple-music.json`);
    }
    return this.httpService.get<AppleMusicTrack[]>(
      `${this.apiUrl}/apple-music`
    );
  }

  refreshAppleMusicTracks(): Observable<null> {
    if (this.isStaticApp) {
      return of(null);
    }
    return this.httpService.post<null>(
      `${this.apiUrl}/refresh-apple-music`,
      null
    );
  }
}
