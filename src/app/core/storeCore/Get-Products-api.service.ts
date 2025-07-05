import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GetProductsApiService{

    private baseUrl = '/api/product';
  constructor(private http: HttpClient) {}

//     getAllProducts(storeId: number): Observable<product[]> {
//     return this.http.get<Product[]>(this.baseUrl);
//   }

  getProductsByVendorStore(storeId: number): Observable<any[]> {
    return this.http.get<any[]>(`https://cloudmall.runasp.net/api/Product/vendor/${storeId}`);
  }

}