import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { CartItem } from './client-cart-api.service';

export interface CheckoutRequest {
  shippingCity: string;
  shippingStreetAddress: string;
}

export interface CheckoutResponse {
  success: boolean;
  message?: string;
  orderId?: string;
  checkoutId?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientCheckoutApiService {
  private baseUrl = `${environment.apiBaseUrl}/orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  checkout(checkoutData: CheckoutRequest): Observable<CheckoutResponse> {
    const token = this.authService.getToken();
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    console.log('Making checkout request with:', {
      url: `${this.baseUrl}/checkout`,
      data: checkoutData,
      headers: headers,
      token: token ? 'Present' : 'Missing'
    });

    // Log the exact JSON being sent
    const requestBody = JSON.stringify(checkoutData);
    console.log('Request body (JSON):', requestBody);
    
    // Log the authorization header specifically
    console.log('Authorization header:', `Bearer ${token}`);
    console.log('Token value:', token);

    return this.http.post<CheckoutResponse>(`${this.baseUrl}/checkout`, checkoutData, { headers })
      .pipe(
        tap(response => {
          console.log('Checkout API response:', response);
        }),
        catchError(error => {
          console.error('Checkout API error details:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message,
            url: error.url,
            headers: error.headers
          });
          
          // Log the actual error response body
          if (error.error) {
            console.error('API Error Response Body:', error.error);
            console.error('API Error Response Body (stringified):', JSON.stringify(error.error));
          }
          
          // Log the full error object for debugging
          console.error('Full error object:', error);
          
          throw error;
        })
      );
  }
} 