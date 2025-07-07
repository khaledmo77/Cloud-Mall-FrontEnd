import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

export interface OrderItem {
  productId: number;
  productName: string;
  productImageUrl: string;
  quantity: number;
  priceAtTimeOfPurchase: number;
}

export interface VendorOrder {
  id: number;
  customerOrderId: number;
  storeName: string;
  orderDate: string;
  subTotal: number;
  status: string;
  clientName: string | null;
  shippingAddress: string;
  orderItems: OrderItem[];
}

export interface Order {
  id: number;
  grandTotal: number;
  orderDate: string;
  overallStatus: string;
  vendorOrders: VendorOrder[];
}

export interface OrdersResponse {
  success: boolean;
  data: {
    totalOrders: number;
    orders: Order[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ClientOrdersApiService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getOrders(): Observable<OrdersResponse> {
    const headers = this.getHeaders();
    return this.http.get<OrdersResponse>(`${environment.apiBaseUrl}/orders`, { headers });
  }
} 