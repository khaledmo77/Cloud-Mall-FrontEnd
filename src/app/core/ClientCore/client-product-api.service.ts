import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private baseUrl = `${environment.apiBaseUrl}/Product`;

  constructor(private https: HttpClient) {}

  getProductsByStore(storeId: number): Observable<Product[]> {
    const url = `${environment.apiBaseUrl}/Product/${storeId}`;
    console.log('Client API - Calling URL:', url);
    console.log('Client API - Store ID:', storeId);
    return this.https.get<Product[]>(url);
  }

  getProductById(productId: number): Observable<Product> {
    return this.https.get<Product>(`${this.baseUrl}/${productId}`);
  }
} 