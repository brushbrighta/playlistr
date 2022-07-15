import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MergedTrack } from '@playlistr/shared/types';

@Injectable({
  providedIn: 'root',
})
export class TracksApiService {
  private apiUrl = '/api';

  constructor(private httpService: HttpClient) {}

  getTracks(): Observable<MergedTrack[]> {
    return this.httpService.get<MergedTrack[]>(`${this.apiUrl}/tracks`);
  }
}
