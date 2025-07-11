import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreProductCategoryApiService {
  private baseUrl = 'https://cloudmall.runasp.net/api/Store/vendor/productcategory';

  constructor(private http: HttpClient) {}

  addProductCategory(storeId: number, data: { name: string; description: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Adding category for store:', storeId);
    console.log('Category data:', data);
    console.log('Token exists:', !!token);
    
    return this.http.post(`${this.baseUrl}/${storeId}`, data, { headers });
  }

  getProductCategories(storeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${storeId}`);
  }
} 