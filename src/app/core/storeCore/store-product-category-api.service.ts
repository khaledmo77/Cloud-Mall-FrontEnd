import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreProductCategoryApiService {
  private baseUrl = '/api/Store/vendor/productcategory';

  constructor(private http: HttpClient) {}

  addProductCategory(storeId: number, data: { name: string; description: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/${storeId}`, data);
  }

  getProductCategories(storeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${storeId}`);
  }
} 