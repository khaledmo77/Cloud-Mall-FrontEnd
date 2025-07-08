import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreInfoService {
  private apiUrl = 'https://cloudmall.runasp.net/api/Store';

  constructor(private http: HttpClient) {}

  getStoreById(storeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-store/${storeId}`);
  }
} 