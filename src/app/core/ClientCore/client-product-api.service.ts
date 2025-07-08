import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
    // Try a client-specific endpoint first
    const url = `${environment.apiBaseUrl}/Product/client/getproductbyid/${productId}`;
    console.log('Client API - Getting product by ID:', url);
    console.log('Client API - Product ID:', productId);
    
    return this.https.get<any>(url).pipe(
      map((response: any) => {
        console.log('Client API - Product by ID response:', response);
        console.log('Client API - Response type:', typeof response);
        console.log('Client API - Response keys:', response && typeof response === 'object' ? Object.keys(response) : 'N/A');
        
        // Handle different response formats
        if (response && response.data) {
          console.log('Client API - Using response.data');
          return response.data;
        } else if (response && typeof response === 'object' && response.id) {
          console.log('Client API - Using response directly');
          return response;
        } else if (response && Array.isArray(response) && response.length > 0) {
          console.log('Client API - Using first item from array');
          return response[0];
        } else if (response && Array.isArray(response.allProducts) && response.allProducts.length > 0) {
          console.log('Client API - Using first item from allProducts array');
          return response.allProducts[0];
        }
        
        console.log('Client API - No valid product data found in response');
        return null;
      }),
      catchError((error) => {
        console.error('Client API - Error getting product by ID:', error);
        console.error('Client API - Error status:', error.status);
        console.error('Client API - Error message:', error.message);
        
        // If client endpoint fails, try the generic endpoint
        if (error.status === 404 || error.status === 403) {
          console.log('Client API - Client endpoint failed, trying generic endpoint');
          const genericUrl = `${environment.apiBaseUrl}/Product/${productId}`;
          return this.https.get<any>(genericUrl).pipe(
            map((response: any) => {
              console.log('Client API - Generic endpoint response:', response);
              if (response && response.data) {
                return response.data;
              } else if (response && typeof response === 'object' && response.id) {
                return response;
              } else if (response && Array.isArray(response) && response.length > 0) {
                return response[0];
              }
              return null;
            }),
            catchError((genericError) => {
              console.error('Client API - Generic endpoint also failed:', genericError);
              return throwError(() => new Error('Failed to load product details'));
            })
          );
        }
        
        return throwError(() => new Error('Failed to load product details'));
      })
    );
  }

  // Add this public method for direct generic endpoint access
  public getProductByIdPublic(productId: number): Observable<any> {
    return this.https.get<any>(`${this.baseUrl}/${productId}`);
  }
} 