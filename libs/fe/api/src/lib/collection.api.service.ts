import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Release } from '@playlistr/shared/types';

@Injectable({
  providedIn: 'root',
})
export class CollectionApiService {
  private apiUrl = 'http://localhost:3333/api';

  constructor(private httpService: HttpClient) {}

  getCollection(): Observable<Release[]> {
    return this.httpService.get<Release[]>(`${this.apiUrl}/collection`);
  }

  refreshRelease(releaseId: number): Observable<Release> {
    return this.httpService.get<Release>(`${this.apiUrl}/update-release/${releaseId}`);
  }

  fetchImageForRelease(releaseId: number) {
    return this.httpService.get<Release[]>(
      `${this.apiUrl}/add-image-to-release/${releaseId}`
    );
  }
}
