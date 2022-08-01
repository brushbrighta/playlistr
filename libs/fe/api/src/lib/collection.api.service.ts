import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AppleMusicTrack, Release } from '@playlistr/shared/types';
import {
  ANGULAR_ENVIRONMENT_SERVICE,
  IEnvironmentService,
} from '@playlistr/fe/environment';

@Injectable({
  providedIn: 'root',
})
export class CollectionApiService {
  private apiUrl = '/api';
  private isStaticApp = this.environmentService.isStaticApp;

  constructor(
    private httpService: HttpClient,
    @Inject(ANGULAR_ENVIRONMENT_SERVICE)
    private environmentService: IEnvironmentService
  ) {}

  getCollection(): Observable<Release[]> {
    if (this.isStaticApp) {
      return this.httpService.get<Release[]>(`collection-releases.json`);
    }
    return this.httpService.get<Release[]>(`${this.apiUrl}/collection`);
  }

  refreshRelease(releaseId: number): Observable<Release> {
    if (this.isStaticApp) {
      return throwError(() => new Error('static mode'));
    }
    return this.httpService.get<Release>(
      `${this.apiUrl}/update-release/${releaseId}`
    );
  }

  fetchImageForRelease(releaseId: number) {
    if (this.isStaticApp) {
      return throwError(() => new Error('static mode'));
    }
    return this.httpService.get<Release[]>(
      `${this.apiUrl}/add-image-to-release/${releaseId}`
    );
  }
}
