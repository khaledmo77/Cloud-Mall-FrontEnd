import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private baseUrl = '/api/Product/vendor';

  constructor(private http: HttpClient) {}

  addProduct(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData);
  }

  getProductsByStore(storeId: number): Observable<any> {
    return this.http.get(`/api/Product/vendor/${storeId}`);
  }
} 