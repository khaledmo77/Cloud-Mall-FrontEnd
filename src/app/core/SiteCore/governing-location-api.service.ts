import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GoverningLocation {
  id: number;
  name: string;
  region: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoverningLocationApiService {
  private apiUrl = 'https://cloudmall.runasp.net/api/GoverningLocation';

  constructor(private http: HttpClient) {}

  getGoverningLocations(): Observable<GoverningLocation[]> {
    return this.http.get<GoverningLocation[]>(this.apiUrl);
  }
} 