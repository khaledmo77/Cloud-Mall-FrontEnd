import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

  getProductById(productId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/Product/vendor/getproductbyid/${productId}`);
  }

  getStoreDetails(storeId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/Store/Vendor/GetOneStore/${storeId}`);
  }
} 