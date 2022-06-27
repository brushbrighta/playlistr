import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppleMusicTrack } from '@playlistr/shared/types';

@Injectable({
  providedIn: 'root',
})
export class AppleMusicTracksApiService {
  private apiUrl = 'http://localhost:3333/api';

  constructor(private httpService: HttpClient) {}

  getAppleMusicTracks(): Observable<AppleMusicTrack[]> {
    return this.httpService.get<AppleMusicTrack[]>(
      `${this.apiUrl}/apple-music`
    );
  }
}
