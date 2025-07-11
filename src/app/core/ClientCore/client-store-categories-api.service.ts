import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StoreProductCategory {
  id: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientStoreCategoriesApiService {
  private baseUrl = 'https://cloudmall.runasp.net/api/Store/productcategory';

  constructor(private http: HttpClient) {}

  /**
   * Get product categories for a specific store
   * @param storeId - The ID of the store
   * @returns Observable of StoreProductCategory array
   */
  getStoreProductCategories(storeId: number): Observable<StoreProductCategory[]> {
    return this.http.get<StoreProductCategory[]>(`${this.baseUrl}/${storeId}`);
  }
} 