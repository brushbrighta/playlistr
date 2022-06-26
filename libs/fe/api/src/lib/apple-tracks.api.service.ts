import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppleMusicTracksApiService {
  private apiUrl = 'http://localhost:3333/api';

  constructor(private httpService: HttpClient) {}

  getAppleMusicTracks(): Observable<any[]> {
    return this.httpService.get<any[]>(`${this.apiUrl}/apple-music`);
  }
}
