import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StoreCategory {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class GetCategoryStoresApiService {
  private apiUrl = 'http://cloudmall.runasp.net/api/StoreCategory';

  constructor(private http: HttpClient) {}

  getStoreCategories(): Observable<StoreCategory[]> {
    return this.http.get<StoreCategory[]>(this.apiUrl);
  }
}
