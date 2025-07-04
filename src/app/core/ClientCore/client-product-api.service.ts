import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  brand?: string;
  sku?: string;
  price: number;
  discount?: number;
  stock?: number;
  imagesURL?: string;
  categoryName?: string;
  averageRate?: number;
  storeID: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientProductApiService {
  private baseUrl = 'http://cloudmall.runasp.net/api/Product';

  constructor(private http: HttpClient) {}

  getProductsByStore(storeId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`http://cloudmall.runasp.net/api/Product/${storeId}`);
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${productId}`);
  }
} 