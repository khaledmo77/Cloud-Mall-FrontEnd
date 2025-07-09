import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';

export interface Store {
  id: number;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  description: string;
  categoryName: string;
  vendorID: string;
  vendorName: string;
  logoURL: string;
  createdAt: string;
  addresses: Array<{
    streetAddress: string;
    notes: string;
    governingLocationName: string;
  }>;
}

export interface StoresResponse {
  pageSize: number;
  totalCount: number;
  currentPage: number;
  totalNumberOfPages: number;
  allStores: Store[];
}

@Injectable({ providedIn: 'root' })
export class AdminStoresApiService {
  private baseUrl = 'https://cloudmall.runasp.net/api/Store/Admin';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllStores(
    pageNumber: number = 1,
    pageSize: number = 10,
    categoryName?: string
  ): Observable<StoresResponse> {
    let params: any = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    if (categoryName) {
      params.categoryName = categoryName;
    }

    const token = this.authService.getToken();
    const headers: any = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.http.get<StoresResponse>(`${this.baseUrl}/GetAllStores`, {
      params,
      headers
    });
  }

  deleteStore(storeId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers: any = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.http.delete(`${this.baseUrl}/DeleteStoreByAdmin/${storeId}`, {
      headers
    });
  }
} 