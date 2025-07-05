import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private baseUrl = 'https://cloudmall.runasp.net/api/Product/vendor';

  constructor(private http: HttpClient) {}

  addProduct(formData: FormData, storeId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${storeId}`, formData);
  }

  getProductsByStore(storeId: number): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/${storeId}`).pipe(
      map(response => response.data || [])
    );
  }
} 