import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
  discount: number | null;
  imagesURL: string;
  categoryName: string;
  averageRate: number;
}

export interface ProductSearchResponse {
  success: boolean;
  data: {
    pageSize: number;
    totalCount: number;
    currentPage: number;
    totalNumberOfPages: number;
    allProducts: Product[];
  };
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StoreProductSearchApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  searchProducts(
    storeId: number,
    params: {
      name?: string;
      brand?: string;
      pageNumber?: number;
      pageSize?: number;
    } = {}
  ): Observable<ProductSearchResponse> {
    const url = `${this.baseUrl}/Product/store/${storeId}/search`;
    
    let httpParams = new HttpParams();
    
    if (params.name) {
      httpParams = httpParams.set('name', params.name);
    }
    
    if (params.brand) {
      httpParams = httpParams.set('brand', params.brand);
    }
    
    if (params.pageNumber) {
      httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    }
    
    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }

    return this.http.get<ProductSearchResponse>(url, { params: httpParams });
  }
} 