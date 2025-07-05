import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface VendorStore {
  id: number;
  name: string;
  description: string;
  logoURL?: string;
  categoryName?: string;
  storeCategoryID?: number;
  vendorID?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorStoresResponse {
  success: boolean;
  data: VendorStore[];
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class VendorStoresApiService {
  private baseUrl = 'https://cloudmall.runasp.net/api/Store/vendor';

  constructor(private http: HttpClient) {}

  getAllStores(): Observable<VendorStore[]> {
    return this.http.get<VendorStoresResponse>(`${this.baseUrl}/getallstores`).pipe(
      map(response => response.data || [])
    );
  }
} 