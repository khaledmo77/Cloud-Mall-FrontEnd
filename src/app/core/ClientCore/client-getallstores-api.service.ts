import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Store {
  id: number;
  name: string;
  logoURL?: string;
  description?: string;
  categoryId?: number;
  categoryName?: string;
  vendorID?: string;
  governingLocationId?: number;
  streetAddress?: string;
  // add any other fields returned by your API
}

export interface GetAllStoresResponse {
  pageSize: number;
  totalCount: number;
  currentPage: number;
  totalNumberOfPages: number;
  allStores: Store[];
}

export interface StoreFilterParams {
  categoryId?: number;
  governingLocationId?: number;
  streetAddress?: string;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientGetAllStoresApiService {
  private apiUrl = 'https://cloudmall.runasp.net/api/Store/get-all-stores';

  constructor(private http: HttpClient) {}

  getAllStores(): Observable<GetAllStoresResponse> {
    return this.http.get<GetAllStoresResponse>(this.apiUrl);
  }

  getStoresPaginated(options?: StoreFilterParams): Observable<GetAllStoresResponse> {
    let params: any = {};
    if (options?.categoryId) params.CategoryId = options.categoryId;
    if (options?.governingLocationId) params.GoverningLocationId = options.governingLocationId;
    if (options?.streetAddress) params.StreetAddress = options.streetAddress;
    if (options?.pageNumber) params.pageNumber = options.pageNumber;
    if (options?.pageSize) params.pageSize = options.pageSize;
    
    console.log('API Service - Sending params:', params);
    return this.http.get<GetAllStoresResponse>(this.apiUrl, { params });
  }
}
