import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private baseUrl = 'https://cloudmall.runasp.net/api/Product/vendor';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

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
    const userRole = this.authService.getUserRole();
    
    // Use different endpoints based on user role
    if (userRole === 'Client') {
      // Client endpoint
      return this.http.get(`${environment.apiBaseUrl}/Store/get-store/${storeId}`);
    } else {
      // Vendor endpoint (default)
      return this.http.get(`${environment.apiBaseUrl}/Store/Vendor/GetOneStore/${storeId}`);
    }
  }
} 